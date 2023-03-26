import { usePledgeRewardContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'

export function usePledgeReward() {
  const { account } = useActiveWeb3React()
  const contract = usePledgeRewardContract()
  const userInfo = useSingleCallResult(contract, 'userInfo', [account ?? undefined])?.result
  const claimableRewards = useSingleCallResult(contract, 'getClaimableAmount', [account ?? undefined])?.result

  return {
    claimableRewards,
    readyToUnlockBalance: userInfo?.balance
  }
}
