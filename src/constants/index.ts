import { AbstractConnector } from '@web3-react/abstract-connector'
import { Currency } from './token'
import { injected, walletconnect } from '../connectors'
import JSBI from 'jsbi'
import { ChainId } from './chain'

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.BSC]: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
  [ChainId.BSCTEST]: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'
}

export const BAST_TOKEN: { [chainId in ChainId]?: Currency } = {
  [ChainId.BSCTEST]: new Currency(ChainId.BSCTEST, '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 18, 'USDT', 'USDT')
}

export const USDT: { [chainId in ChainId]: Currency } = {
  [ChainId.BSC]: new Currency(ChainId.BSCTEST, '0x3a29e93Ec71562dc921ee123C31ed3001aaD6e39', 18, 'USDT', 'USDT'),
  [ChainId.BSCTEST]: new Currency(ChainId.BSCTEST, '0x3a29e93Ec71562dc921ee123C31ed3001aaD6e39', 18, 'USDT', 'USDT')
}

export const CPS: { [chainId in ChainId]: Currency } = {
  [ChainId.BSC]: new Currency(ChainId.BSCTEST, '0x40DE0F5f58d5365eD5e638B793bC3F551229CEc9', 18, 'CPS', 'CPS'),
  [ChainId.BSCTEST]: new Currency(ChainId.BSCTEST, '0xAAD8fFd74434C8E508C92F9C80147CA43ED483cb', 18, 'CPS', 'CPS')
}

export const LIQUIDITY_TOKEN: { [chainId in ChainId]?: Currency } = {
  [ChainId.BSCTEST]: new Currency(ChainId.BSCTEST, '0x322978fc494a559bB4a3Db6aE50aa45B89528C28', 18, 'CPS', 'CPS')
}

export const NFT: { [chainId in ChainId]: Currency } = {
  [ChainId.BSC]: new Currency(ChainId.BSCTEST, '0x6931B140BC21a0755c0B7F2A07E9d611e203B16F', 18, 'NFT', 'NFT'),
  [ChainId.BSCTEST]: new Currency(ChainId.BSCTEST, '0x6931B140BC21a0755c0B7F2A07E9d611e203B16F', 18, 'NFT', 'NFT')
}

export const LPMine_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.BSC]: '0x2B393Dcd63540710cf5435C46A0B3cEdd1DEC6C0',
  [ChainId.BSCTEST]: '0x2B393Dcd63540710cf5435C46A0B3cEdd1DEC6C0'
}

export const LPMineLOCK_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.BSC]: '0xE121F1C99fe55a01F67F6E4803c6b00063D6C2D4',
  [ChainId.BSCTEST]: '0xE121F1C99fe55a01F67F6E4803c6b00063D6C2D4'
}

export const NFTMine_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.BSC]: '0xF2e4D9B6Ff865Cd1ede99cd6bd0967BB7686f135',
  [ChainId.BSCTEST]: '0xF2e4D9B6Ff865Cd1ede99cd6bd0967BB7686f135'
}

export const autoConnectInjectedEveryone = false

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5'
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 1000
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]
