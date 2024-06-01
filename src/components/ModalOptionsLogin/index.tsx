import { OpenIdProvider } from "@/types/AccountData";
import { motion } from "framer-motion";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import useZkLogin from "@/hooks/zkLogin";

type ModalChainsType = {
  setShow: Dispatch<SetStateAction<boolean>>;
};

const ModalOptionsLogin = ({ setShow }: ModalChainsType) => {

  const {beginZkLogin} = useZkLogin();
  
  const openIdProviders: OpenIdProvider[] = ["Google", "Twitch"];

  return (
    <div className="fixed inset-0 z-10 flex">
      <div
        onClick={() => setShow(false)}
        className="absolute inset-0 bg-[rgba(244,244,244,0.30)] backdrop-blur-[10px]"
      ></div>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 120 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delayChildren: 1.5, staggerChildren: 1 },
          },
        }}
        initial="hidden"
        whileInView="visible"
        className="w-[382px] h-[316px] rounded-3xl gap-5 flex flex-col items-center p-10 bg-[#FFFFFF] m-auto z-20"
      >
        <div className=" font-semibold text-lg text-right cursor-pointer w-full">
          <span
            className="p-2 rounded-xl text-[#3B3B3B]"
            onClick={() => setShow(false)}
          >
            🗙
          </span>
        </div>
        <h2 className="font-semibold text-lg text-center capitalize text-[#3B3B3B]">
          Sign in with <br /> your preferred service
        </h2>

        <div className="w-full flex justify-center gap-4">
          {openIdProviders.map((provider) => (
            <button
              className="rounded-xl p-4 bg-[#EDF5FF]"
              onClick={() => {
                beginZkLogin(provider);
              }}
              key={provider}
            >
              <Image
                src={`/images/connect-wallet-modal/${provider.toLowerCase()}.png`}
                alt={provider}
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ModalOptionsLogin;
