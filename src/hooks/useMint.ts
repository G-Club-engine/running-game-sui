import SUI_CLIENT from '@/services/suiClient'
import { SerializedSignature, decodeSuiPrivateKey } from '@mysten/sui.js/cryptography'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { genAddressSeed, getZkLoginSignature } from '@mysten/zklogin'
import { useEffect, useState } from 'react'
const accountDataKey = 'zklogin.accounts'

type OpenIdProvider = 'Google' | 'Twitch' | 'Facebook'

type AccountData = {
  provider: OpenIdProvider
  userAddr: string
  zkProofs: {
    headerBase64: string
    issBase64Details: {
      value: string
      indexMod4: number
    }
    indexMod4: number
    value: string
    proofPoints: {
      a: string[]
      b: string[][]
      c: string[]
    }
  }
  ephemeralPrivateKey: string
  userSalt: string
  sub: string
  aud: string
  maxEpoch: number
}

type NFTParamsType = {
  name: string
  description: string
  image: string
}

const useMint = () => {
  const accountDataKey = 'zklogin-demo.rolling-ball.account'
  const [account, setAccount] = useState<AccountData>()

  const loadAccounts = () => {
    const dataRaw = localStorage.getItem(accountDataKey)
    if (!dataRaw) {
      return
    }
    const data: AccountData = JSON.parse(dataRaw)
    return data
  }

  const [balance, setBalance] = useState(0)

  async function fetchBalances(account: AccountData) {
    const suiBalance = await SUI_CLIENT.getBalance({
      owner: account.userAddr,
      coinType: '0x2::sui::SUI',
    })

    setBalance(parseInt(suiBalance.totalBalance, 10) / 1_000_000_000)
  }

  useEffect(() => {
    setAccount(loadAccounts())
  }, [])

  useEffect(() => {
    if (account) fetchBalances(account)
  }, [account])

  const createMintNftTxnBlock = async (account: AccountData, name: string, description: string, url: string) => {
    if (account) {
      // console.log('account', account)
      // define a programmable transaction block
      const txb = new TransactionBlock()
      txb.setSender(account.userAddr) // Access the userAddr property of the first element in the account array
      // note that this is a devnet contract address
      const contractAddress = '0x94da855248247602756c7ab111cac9a0ba35831965c9d4b2cc968147d8cc1f7b'
      const contractModule = 'nft'
      const contractMethod = 'mint'
      txb.moveCall({
        target: `${contractAddress}::${contractModule}::${contractMethod}`,
        arguments: [
        // txb.pure(name || 'Minted NFT'), 
        // txb.pure(description || 'description'), 
        // txb.pure(image)
          txb.pure(name || "Test NFT"),
          txb.pure(description || "Test description"),
          txb.pure(url || "https://i.ibb.co/W3ZsKXm/Madlads1.png"),
          // txb.pure({"keys": ["nft_type"]}),
          // txb.pure(["nft_type"]),
          // txb.pure(["rolling_ball"]),
          // // txb.pure({"values": ["rolling_ball"]}),
          // txb.pure(account.userAddr || "0xb030a7bc43d2fbec80f173e0e85e21d119a9b7a0114f96394bf3a4192806842b"),
      ],
      })
      console.log(account)
      const ephemeralKeyPair = keypairFromSecretKey(account.ephemeralPrivateKey)
      const { bytes, signature: userSignature } = await txb.sign({
        client: SUI_CLIENT,
        signer: ephemeralKeyPair,
      })

      // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience)
      const addressSeed = genAddressSeed(BigInt(account.userSalt), 'sub', account.sub, account.aud).toString()

      // Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
      // and the ephemeral signature (userSignature)
      // console.log(getFullnodeUrl('testnet'));
      const zkLoginSignature: SerializedSignature = getZkLoginSignature({
        inputs: {
          ...account.zkProofs,
          addressSeed,
        },
        maxEpoch: account.maxEpoch,
        userSignature,
      })

      // Execute the transaction
      await SUI_CLIENT.executeTransactionBlock({
        transactionBlock: bytes,
        signature: zkLoginSignature,
        options: {
          showEffects: true,
        },
      })
        .then((result) => {
          console.log('[sendTransaction] executeTransactionBlock response:', result)
          fetchBalances(account)
        })
        .catch((error: unknown) => {
          console.log('[sendTransaction] executeTransactionBlock failed:', error)
          return null
        })
        console.log("Hello");
      console.log(txb)
      return txb
    }
  }

  function keypairFromSecretKey(privateKeyBase64: string): Ed25519Keypair {
    const keyPair = decodeSuiPrivateKey(privateKeyBase64)
    return Ed25519Keypair.fromSecretKey(keyPair.secretKey)
  }

  const onMint = async ({ name, description, image }: NFTParamsType) => {
    console.log('....', account)
    if (account) {
      await createMintNftTxnBlock(account, name, description, image)
    }
  }
  return {
    onMint,
    createMintNftTxnBlock,
  }
}

export default useMint
