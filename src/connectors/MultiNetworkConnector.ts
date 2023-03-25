import { NetworkConnector } from './NetworkConnector'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId, SUPPORTED_NETWORKS } from '../constants/chain'

export function getRpcUrl(chainId: ChainId) {
  switch (chainId) {
    case ChainId.BSC:
      return 'https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY
    default:
      return SUPPORTED_NETWORKS[chainId]?.rpcUrls[0] || ''
  }
}

export function getOtherNetworkLibrary(chainId: ChainId) {
  const rpc = getRpcUrl(chainId)
  if (!rpc) return undefined
  return new Web3Provider(
    new NetworkConnector({
      urls: {
        [chainId]: getRpcUrl(chainId)
      }
    }).provider as any
  )
}
