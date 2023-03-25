import { usePledgeContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useCallback } from 'react'
import { CurrencyAmount } from '../constants/token'
import JSBI from 'jsbi'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from './index'
import { LIQUIDITY_TOKEN } from '../constants'
import { useTransactionAdder } from '../state/transactions/hooks'
// import { useI18n } from 'react-simple-i18n'

export function usePledge() {
  // const { t } = useI18n()
  const { chainId, account } = useActiveWeb3React()
  const contract = usePledgeContract()
  const addTransaction = useTransactionAdder()

  const userInfo = useSingleCallResult(contract, 'userInfo', [account ?? undefined])?.result
  const pendingReward = useSingleCallResult(contract, 'getPendingReward', [account ?? undefined])?.result
  const totalPledgeAmount = useSingleCallResult(
    contract,
    'balanceOf',
    [LIQUIDITY_TOKEN[chainId ?? 56]?.address],
    undefined,
    chainId
  )?.result
  console.log(userInfo)

  const deposit = useCallback(
    async (address: string, amount: CurrencyAmount, typeIndex: string) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      if (amount.equalTo(JSBI.BigInt('0'))) throw new Error('amount is un support')
      const args = [address, amount.raw.toString(), typeIndex]
      const method = 'deposit'
      console.log('🚀 ~ file: deposit.ts ~ line 18 ~ args', args, method)
      return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
        return contract[method](...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `pledge success`
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract]
  )

  const withdraw = useCallback(
    async (amount: CurrencyAmount) => {
      if (!account) throw new Error('none account')
      if (!contract) throw new Error('none contract')
      const args = [amount.raw.toString()]
      const method = 'withdraw'
      console.log('🚀 ~ file: withdraw.ts ~ line 18 ~ args', args, method)
      return contract.estimateGas[method]({ from: account }).then(estimatedGasLimit => {
        return contract[method]({
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasLimit: '3500000',
          from: account
        }).then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: `withdraw LP`
          })
          return response.hash
        })
      })
    },
    [account, addTransaction, contract]
  )

  // const getPendingReward = useCallback(async () => {
  //   if (!account) throw new Error('none account')
  //   if (!contract) throw new Error('none contract')
  //   const method = 'getPendingReward'
  //   console.log('🚀 ~ file: stake.ts ~ line 18 ~ args', method)
  //   return contract.estimateGas[method]({ from: account }).then(estimatedGasLimit => {
  //     return contract[method]({
  //       gasLimit: calculateGasMargin(estimatedGasLimit),
  //       // gasLimit: '3500000',
  //       from: account
  //     }).then((response: TransactionResponse) => {
  //       addTransaction(response, {
  //         summary: `getPendingReward`
  //       })
  //       return response.hash
  //     })
  //   })
  // }, [account, addTransaction, contract])

  const claimReward = useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')
    const method = 'register'
    console.log('🚀 ~ file: pledge.ts ~ line 18 ~ args', method)
    return contract.estimateGas[method]({ from: account }).then(estimatedGasLimit => {
      return contract[method]({
        gasLimit: calculateGasMargin(estimatedGasLimit),
        // gasLimit: '3500000',
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `claimReward`,
          claim: { recipient: `${account}_bind` }
        })
        return response.hash
      })
    })
  }, [account, addTransaction, contract])
  return {
    lpAmount: userInfo?.lpAmount,
    unlockTime: userInfo?.lastStakeTime,
    deposit,
    withdraw,
    claimReward,
    pendingReward,
    totalPledgeAmount: totalPledgeAmount?.[0]
  }
}
