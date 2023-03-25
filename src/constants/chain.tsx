import { Chain } from 'models/chain'
import BSCUrl from 'assets/svg/binance.svg'
import { ReactComponent as BSC } from 'assets/svg/binance.svg'
import BigNumberjs from 'bignumber.js'

export function numberToHex(number: number) {
  return '0x' + new BigNumberjs(number).toString(16)
}

export enum ChainId {
  BSC = 56,
  BSCTEST = 97
}

export const NETWORK_CHAIN_ID: ChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID)
  : ChainId.BSC

export const SUPPORT_NETWORK_CHAIN_IDS: ChainId[] = process.env.REACT_APP_CHAIN_IDS
  ? process.env.REACT_APP_CHAIN_IDS.split(',').map(v => Number(v) as ChainId)
  : [ChainId.BSC]

export const AllChainList = [
  {
    icon: <BSC height={20} width={20} />,
    logo: BSCUrl,
    symbol: 'BSC',
    name: 'BNB Chain',
    id: ChainId.BSC,
    hex: numberToHex(ChainId.BSC)
  },
  {
    icon: <BSC />,
    logo: BSCUrl,
    symbol: 'BSCTEST',
    name: 'BNB Testnet',
    id: ChainId.BSCTEST,
    hex: numberToHex(ChainId.BSCTEST)
  }
]

export const ChainList = AllChainList.filter(v => SUPPORT_NETWORK_CHAIN_IDS.includes(v.id))

export const ChainListMap: {
  [key in ChainId]?: { icon: JSX.Element; link?: string; selectedIcon?: JSX.Element } & Chain
} = ChainList.reduce((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as any)

function getChainIdHex(chainId: ChainId) {
  return ChainListMap[chainId]?.hex || '0x1'
}

export const SUPPORTED_NETWORKS: {
  [chainId in ChainId]?: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
      logo?: string
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  }
} = {
  [ChainId.BSC]: {
    chainId: getChainIdHex(ChainId.BSC),
    chainName: ChainListMap[ChainId.BSC]?.name || '',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      logo: ChainListMap[ChainId.BSC]?.logo
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com']
  },
  [ChainId.BSCTEST]: {
    chainId: getChainIdHex(ChainId.BSCTEST),
    chainName: ChainListMap[ChainId.BSCTEST]?.name || '',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      logo: ChainListMap[ChainId.BSCTEST]?.logo
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com/']
  }
}
