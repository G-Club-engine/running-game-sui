import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { NetworkName } from '@polymedia/suits'

const NETWORK: NetworkName = 'testnet'

const SUI_CLIENT = new SuiClient({
  url: getFullnodeUrl(NETWORK),
})

export default SUI_CLIENT
