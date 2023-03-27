import { usePledgeRewardContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils'
import { useActiveWeb3React } from './index'
import { TransactionResponse } from '@ethersproject/providers'
import { useCallback } from 'react'

export function useLpmineRewardLockc() {
  const { account } = useActiveWeb3React()
  const contract = usePledgeRewardContract()
  const addTransaction = useTransactionAdder()
  const userInfo = useSingleCallResult(contract, 'userInfo', [account ?? undefined])?.result
  const claimableLpMineLockRewards = useSingleCallResult(contract, 'getClaimableAmount', [account ?? undefined])?.result

  const lpMineClaim = useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')
    const method = 'claim'
    console.log('🚀 ~ file: lpmine.ts ~ line 18 ~ args', method)
    return contract.estimateGas[method]({ from: account }).then(estimatedGasLimit => {
      return contract[method]({
        gasLimit: calculateGasMargin(estimatedGasLimit),
        // gasLimit: '3500000',
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `claim`,
          claim: { recipient: `${account}_bind` }
        })
        return response.hash
      })
    })
  }, [account, addTransaction, contract])

  return {
    lpMineClaim,
    claimableLpMineLockRewards,
    readyToUnlockLpMineBalance: userInfo?.balance
  }
}
