"use client";
import ModalOptionsLogin from "@/components/ModalOptionsLogin";
import { useEffect } from "react";
import { Unity } from "react-unity-webgl";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import useBalance from "@/hooks/useBalance";
import useUnity from "@/hooks/useUnity";
import useZkLogin from "@/hooks/zkLogin";

const HomePage = () => {
  const wallet = useWallet();
  const { getBalance } = useBalance();
  const { completeZkLogin } = useZkLogin();

  const {
    unityProvider,
    addEventListener,
    removeEventListener,
    sendMessage,
    isLoaded,
    loadingProgression,
    connectSuiWallet,
    connectMetamask,
    disconnect,
    mintNFT,
    upLevel,
    showModalOptions,
    showOptions,
    setShowOptions,
    getBalanceAction,
  } = useUnity();

  useEffect(() => {
    if (wallet.account?.address && isLoaded) {
      getBalance(wallet.account?.address || "").then((balance) => {
        sendMessage("MenuManager", "ChangeBalance", balance.toString());
      });
      sendMessage("MenuManager", "ChangeAddress", wallet.account?.address);
      sendMessage("MenuManager", "ChangeTypeWallet", "sui");
      sendMessage("MenuManager", "ChangeTypeLogin", "wallet");
    }
  }, [wallet, isLoaded, sendMessage, getBalance]);

  // let account = loadAccounts();

  useEffect(() => {
    completeZkLogin();
  }, [completeZkLogin]);

  useEffect(() => {
    addEventListener("Disconnect", disconnect);
    addEventListener("ZkLogin", showModalOptions);
    addEventListener("ConnectMetamask", connectMetamask);
    addEventListener("MintNFT", mintNFT);
    addEventListener("ConnectSuiWallet", connectSuiWallet);
    addEventListener("UpLevel", upLevel);
    addEventListener("GetBalance", getBalanceAction);
    return () => {
      removeEventListener("Disconnect", disconnect);
      removeEventListener("ZkLogin", showModalOptions);
      removeEventListener("ConnectMetamask", connectMetamask);
      removeEventListener("MintNFT", mintNFT);
      removeEventListener("ConnectSuiWallet", connectSuiWallet);
      removeEventListener("UpLevel", upLevel);
      removeEventListener("GetBalance", getBalanceAction);
    };
  }, [
    addEventListener,
    removeEventListener,
    showModalOptions,
    disconnect,
    connectMetamask,
    mintNFT,
    connectSuiWallet,
    getBalanceAction,
    upLevel,
    isLoaded,
  ]);

  return (
    <>
      <div id="sui_connect" className="opacity-0 h-0 absolute top-[-50px]">
        <ConnectButton />
      </div>
      {showOptions && <ModalOptionsLogin setShow={setShowOptions} />}
      {!isLoaded && (
        <div className="absolute top-[50%]">
          <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
        </div>
      )}
      <Unity className="w-full h-full" unityProvider={unityProvider} />
    </>
  );
};

export default HomePage;
