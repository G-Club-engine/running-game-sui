import { AccountData, SetupData } from "@/types/AccountData";
import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import config from "../../config.json";

// Begin ZkLogin
export const loadSetupData = (): SetupData | null => {
  const dataRaw = localStorage.getItem(config.SETUP_DATA_KEY);
  if (!dataRaw) {
    return null;
  }
  const data: SetupData = JSON.parse(dataRaw);
  return data;
};

export const keypairFromSecretKey = (
  privateKeyBase64: string
): Ed25519Keypair => {
  const keyPair = decodeSuiPrivateKey(privateKeyBase64);
  return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
};

export const saveAccount = (account: AccountData): void => {
  const newAccounts = account;
  localStorage.setItem(config.ACCOUNT_DATA_KEY, JSON.stringify(newAccounts));
};

export const saveSetupData = (data: SetupData) => {
  localStorage.setItem(config.SETUP_DATA_KEY, JSON.stringify(data));
};

export const loadAccounts = () => {
  if (typeof localStorage === "undefined") {
    return null;
  }
  const dataRaw = localStorage.getItem(config.ACCOUNT_DATA_KEY);
  if (!dataRaw) {
    return null;
  }
  const data: AccountData = JSON.parse(dataRaw);
  return data;
};
// End ZkLogin
