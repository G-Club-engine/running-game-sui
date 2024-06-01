import { JwtPayload } from "@/types/JWTPayload";
import { jwtDecode } from "jwt-decode";
import config from "../../config.json";
import {
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  jwtToAddress,
} from "@mysten/zklogin";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { OpenIdProvider } from "@/types/AccountData";
import useUnity from "./useUnity";
import {
  keypairFromSecretKey,
  loadSetupData,
  saveAccount,
  saveSetupData,
} from "@/utils/local";
import SUI_CLIENT from "@/services/suiClient";

const useZkLogin = () => {
  const { sendMessage, isLoaded } = useUnity();

  const completeZkLogin = async () => {
    const urlFragment = window.location.hash.substring(1);
    if (urlFragment != "" && isLoaded == true) {
      const urlParams = new URLSearchParams(urlFragment);
      const jwt = urlParams.get("id_token");

      if (!jwt) {
        localStorage.removeItem("isVerifying");
        return;
      }

      //   Remove URL fragment
      window.history.replaceState(null, "", window.location.pathname);

      //   Decode JWT
      const jwtPayload = jwtDecode(jwt) as JwtPayload;

      if (!jwtPayload.sub || !jwtPayload.aud) {
        // console.warn('[completeZkLogin] missing jwt.sub or jwt.aud')
        return;
      }

      const requestOptions =
        config.URL_SALT_SERVICE === "/dummy-salt-service.json"
          ? // dev, using a JSON file (same salt all the time)
            {
              method: "GET",
            }
          : // prod, using an actual salt server
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jwt }),
            };

      const saltResponse: { salt: string } | null = await fetch(
        config.URL_SALT_SERVICE,
        requestOptions
      )
        .then((res) => {
          // console.debug('[completeZkLogin] salt service success')
          return res.json();
        })
        .catch((error: unknown) => {
          // console.warn('[completeZkLogin] salt service error:', error)
          return null;
        });

      if (!saltResponse) {
        return;
      }

      const userSalt = BigInt(saltResponse.salt);

      const userAddr = jwtToAddress(jwt, userSalt);

      const setupData = loadSetupData();
      if (!setupData) {
        // console.warn('[completeZkLogin] missing session storage data')
        return;
      }
      localStorage.removeItem(config.SETUP_DATA_KEY);

      // === Get the zero-knowledge proof ===
      // https://docs.sui.io/concepts/cryptography/zklogin#get-the-zero-knowledge-proof

      const ephemeralKeyPair = keypairFromSecretKey(
        setupData.ephemeralPrivateKey
      );
      const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();
      const payload = JSON.stringify(
        {
          maxEpoch: setupData.maxEpoch,
          jwtRandomness: setupData.randomness,
          extendedEphemeralPublicKey:
            getExtendedEphemeralPublicKey(ephemeralPublicKey),
          jwt,
          salt: userSalt.toString(),
          keyClaimName: "sub",
        },
        null,
        2
      );
      const zkProofs = await fetch(config.URL_ZK_PROVER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })
        .then((res) => {
          // console.debug('[completeZkLogin] ZK proving service success')
          return res.json();
        })
        .catch((error: unknown) => {
          // console.warn('[completeZkLogin] ZK proving service error:', error)
          return null;
        });

      if (!zkProofs) {
        return;
      }
      sendMessage("SetupGameValue", "ChangeAddress", userAddr);
      sendMessage("SetupGameValue", "ChangeTypeWallet", "sui");
      sendMessage("SetupGameValue", "ChangeTypeLogin", "zkLogin");
      saveAccount({
        provider: setupData.provider,
        userAddr,
        zkProofs,
        ephemeralPrivateKey: setupData.ephemeralPrivateKey,
        userSalt: userSalt.toString(),
        sub: jwtPayload.sub,
        aud:
          typeof jwtPayload.aud === "string"
            ? jwtPayload.aud
            : jwtPayload.aud[0],
        maxEpoch: setupData.maxEpoch,
      });
      localStorage.setItem("wallet_type", "sui");
    }
  };

  const beginZkLogin = async (provider: OpenIdProvider) => {
    const { epoch } = await SUI_CLIENT.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + 22; // this means the ephemeral key will be active for 2 epochs from now.
    const ephemeralKeyPair = new Ed25519Keypair();
    const randomness = generateRandomness();
    const nonce = generateNonce(
      ephemeralKeyPair.getPublicKey(),
      maxEpoch,
      randomness
    );

    saveSetupData({
      provider,
      maxEpoch,
      randomness: randomness.toString(),
      ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
    });

    // Start the OAuth flow with the OpenID provider
    const urlParamsBase = {
      nonce: nonce,
      redirect_uri: window.location.origin,
      response_type: "id_token",
      scope: "openid",
    };
    let loginUrl: string;
    switch (provider) {
      case "Google": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,

          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_GOOGLE || "",
        });

        loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams.toString()}`;
        break;
      }
      case "Twitch": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID_TWITCH || "",
          force_verify: "true",
          lang: "en",
          login_type: "login",
        });
        loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`;
        break;
      }
    }
    window.location.replace(loginUrl!);
  };

  return { completeZkLogin, beginZkLogin };
};

export default useZkLogin;
