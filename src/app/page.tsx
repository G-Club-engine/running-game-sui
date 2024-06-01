"use client";
import ModalOptionsLogin from "@/components/ModalOptionsLogin";
import HomePage from "@/pages/HomePage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

export default function Home() {
  // const [isClient, setIsClient] = useState(false);
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);
  return (
    <main className="flex h-[100vh] min-h-screen flex-col items-center justify-between">
      {/* {isClient && (
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            dappMetadata: {
              name: "Rolling Ball Game",
              url: window.location.href,
            },
            // infuraAPIKey: process.env.INFURA_API_KEY,
            // Other options.
          }}
        >
        </MetaMaskProvider>
      )} */}
      <WalletProvider>
        <HomePage />
      </WalletProvider>
    </main>
  );
}
