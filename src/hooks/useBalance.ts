import SUI_CLIENT from "@/services/suiClient";
import { useState } from "react";

const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const getBalance = async (address: string) => {
    const suiBalance = await SUI_CLIENT.getBalance({
      owner: address,
      coinType: "0x2::sui::SUI",
    });
    setBalance(parseInt(suiBalance.totalBalance, 10) / 1_000_000_000);
    return parseInt(suiBalance.totalBalance, 10) / 1_000_000_000;
  };

  return { getBalance, balance };
};

export default useBalance;
