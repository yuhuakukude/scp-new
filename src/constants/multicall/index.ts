import MULTICALL_ABI from './abi.json'
import { ChainId } from '../chain'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  [ChainId.BSCTEST]: '0x1b37e704388e2f544c62177173e62ac46ce0b9e7'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
