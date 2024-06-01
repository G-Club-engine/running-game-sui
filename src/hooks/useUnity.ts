import { useUnityContext } from "react-unity-webgl";
import useBalance from "./useBalance";
import { useCallback, useState } from "react";
import { useAccountBalance, useWallet } from "@suiet/wallet-kit";
import config from "../../config.json";
import { useSDK } from "@metamask/sdk-react";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const useUnity = () => {
  const wallet = useWallet();
  const { sdk } = useSDK();
  const [showOptions, setShowOptions] = useState(false);
  const { balance, getBalance } = useBalance();
  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    sendMessage,
    isLoaded,
    loadingProgression,
  } = useUnityContext({
    loaderUrl: "Build/RollingBall.loader.js",
    dataUrl: "Build/RollingBall.data",
    frameworkUrl: "Build/RollingBall.framework.js",
    codeUrl: "Build/RollingBall.wasm",
  });

  const connectSuiWallet = useCallback(() => {
    const button = document.getElementById("sui_connect");
    if (button?.firstChild) {
      (button.firstChild as any).click();
    }
    if (wallet.account?.address && isLoaded) {
      sendMessage("MenuManager", "ChangeAddress", wallet.account?.address);
      sendMessage("MenuManager", "ChangeTypeWallet", "sui");
      sendMessage("MenuManager", "ChangeTypeLogin", "wallet");
    }
  }, [isLoaded, sendMessage, wallet]);

  const connectMetamask = useCallback(() => {
    if (isLoaded) {
      try {
        sdk?.connect().then((accounts) => {
          localStorage.setItem("metamaskAccounts", accounts);
          localStorage.setItem("wallet_type", "metamask");
          sendMessage("MenuManager", "ChangeAddress", accounts?.[0]);
          sendMessage("MenuManager", "ChangeTypeWallet", "metamask");
        });
      } catch (err) {
        console.warn("failed to connect..", err);
      }
    }
  }, [sendMessage, sdk, isLoaded]);

  const disconnect = useCallback(() => {
    localStorage.removeItem(config.ACCOUNT_DATA_KEY);
    localStorage.removeItem("metamaskAccounts");
    localStorage.setItem("wallet_type", "");
    console.log(isLoaded);
    if (wallet?.account?.address) {
      sendMessage("MenuManager", "ChangeBalance", "0");
      wallet.disconnect();
    }
  }, [isLoaded, sendMessage, wallet]);

  const mintNFT = useCallback(
    (image_url: any, name: any) => {
      if (!wallet.connected || !isLoaded) return;
      const txb = new TransactionBlock();
      const contractAddress =
        "0xb58f966ce0cd4ca0abcdfa11b076f74369966120e540409e00669b6baa4ff7fe";
      const contractModule = "nft";
      const contractMethod = "mint";
      txb.moveCall({
        target: `${contractAddress}::${contractModule}::${contractMethod}`,
        arguments: [txb.pure(name), txb.pure(name), txb.pure(image_url)],
      });
      try {
        // call the wallet to sign and execute the transaction
        wallet
          .signAndExecuteTransactionBlock({
            transactionBlock: txb,
          })
          .then((res) => {
            setTimeout(() => {
              getBalance(wallet.account?.address || "").then((balance) => {
                sendMessage("MenuManager", "ChangeBalance", balance.toString());
              });
              sendMessage("Shop", "MintNftSuccess", 1);
            }, 2500);
          })
          .catch((err) => {
            if (err.message.includes("lower than the needed amount")) {
              sendMessage("Shop", "OpenNotificationUI");
            }
            sendMessage("Shop", "MintNftSuccess", 0);
          });
      } catch (e) {
        console.error("nft mint failed", e);
        sendMessage("Shop", "MintNftSuccess", 0);
      }
    },
    [isLoaded, wallet, sendMessage, getBalance]
  );

  const upLevel = useCallback(
    (objectId: any) => {
      if (!wallet.connected || !isLoaded) return;
      const txb = new TransactionBlock();
      const contractAddress =
        "0xb58f966ce0cd4ca0abcdfa11b076f74369966120e540409e00669b6baa4ff7fe";
      const contractModule = "nft";
      const contractMethod = "upgrade_level";
      txb.moveCall({
        target: `${contractAddress}::${contractModule}::${contractMethod}`,
        arguments: [txb.pure(objectId)],
      });
      try {
        // call the wallet to sign and execute the transaction
        wallet
          .signAndExecuteTransactionBlock({
            transactionBlock: txb,
          })
          .then(async (res) => {
            setTimeout(() => {
              getBalance(wallet.account?.address || "").then((balance) => {
                sendMessage("MenuManager", "ChangeBalance", balance.toString());
              });
              sendMessage("Shop", "UpgradeLevelSuccess", 1);
            }, 3000);
          })
          .catch((err) => {
            if (err.message.includes("lower than the needed amount")) {
              sendMessage("Shop", "OpenNotificationUI");
            }
            sendMessage("Shop", "UpgradeLevelSuccess", 0);
          });
      } catch (e) {
        console.error("upgrade level failed", e);
        sendMessage("Shop", "UpgradeLevelSuccess", 0);
      }
    },
    [isLoaded, wallet, sendMessage, getBalance]
  );

  const showModalOptions = () => {
    setShowOptions(true);
  };

  const getBalanceAction = () => {
    getBalance(wallet.account?.address || "").then((balance) => {
      sendMessage("MenuManager", "ChangeBalance", balance.toString());
    });
  }

  return {
    unityProvider,
    addEventListener,
    removeEventListener,
    sendMessage,
    isLoaded,
    loadingProgression,
    connectSuiWallet,
    disconnect,
    connectMetamask,
    mintNFT,
    upLevel,
    showOptions,
    showModalOptions,
    setShowOptions,
    getBalanceAction,
  };
};

export default useUnity;
