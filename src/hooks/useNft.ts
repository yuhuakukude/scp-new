import { useNFTContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
// import { useCallback } from 'react'
// import { CurrencyAmount } from '../constants/token'
// import JSBI from 'jsbi'
// import { calculateGasMargin } from '../utils'
// import { TransactionResponse } from '@ethersproject/providers'
// import { useActiveWeb3React } from './index'
// import { useTransactionAdder } from '../state/transactions/hooks'
// import { BigNumber } from 'bignumber.js'

export function useNFT() {
  // const { account } = useActiveWeb3React()
  const contract = useNFTContract()
  // const addTransaction = useTransactionAdder()
  const totalNFTSupply = useSingleCallResult(contract, 'totalSupply')?.result
  console.log(totalNFTSupply)

  // const deposit = useCallback(
  //   async (address: string, amount: CurrencyAmount, typeIndex: string) => {
  //     if (!account) throw new Error('none account')
  //     if (!contract) throw new Error('none contract')
  //     if (amount.equalTo(JSBI.BigInt('0'))) throw new Error('amount is un support')
  //     const args = [address, amount.raw.toString(), typeIndex]
  //     const method = 'deposit'
  //     console.log('🚀 ~ file: deposit.ts ~ line 18 ~ args', args, method)
  //     return contract.estimateGas[method](...args, { from: account }).then(estimatedGasLimit => {
  //       return contract[method](...args, {
  //         gasLimit: calculateGasMargin(estimatedGasLimit),
  //         // gasLimit: '3500000',
  //         from: account
  //       }).then((response: TransactionResponse) => {
  //         addTransaction(response, {
  //           summary: `pledge success`
  //         })
  //         return response.hash
  //       })
  //     })
  //   },
  //   [account, addTransaction, contract]
  // )

  return {
    totalNFTSupply
  }
}
