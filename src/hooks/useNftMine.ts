import { useNFTContract, useNFTMineContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useCallback } from 'react'
import { calculateGasMargin } from '../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from './index'
import { useTransactionAdder } from '../state/transactions/hooks'
// import { BigNumber } from 'bignumber.js'

export function useNftMine() {
  const { account } = useActiveWeb3React()
  const contract = useNFTMineContract()
  const nftContract = useNFTContract()
  const addTransaction = useTransactionAdder()
  const balanceOfNFT = useSingleCallResult(contract, 'balanceOf', [account ?? ''])?.result
  const totalSupply = useSingleCallResult(contract, 'totalSupply')?.result
  const additionalNFTPower = useSingleCallResult(contract, 'additionalPower', [account ?? ''])?.result
  const getNFTPendingReward = useSingleCallResult(contract, 'getPendingReward', [account ?? ''])?.result

  const mint = useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!nftContract) throw new Error('none contract')
    const method = 'mint'
    console.log('🚀 ~ file: deposit.ts ~ line 18 ~ args', method)
    return nftContract.estimateGas[method]({ from: account }).then(estimatedGasLimit => {
      return nftContract[method]({
        gasLimit: calculateGasMargin(estimatedGasLimit),
        // gasLimit: '3500000',
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Mint nft`,
          userSubmitted: { account: account, action: 'mint' }
        })
        return response.hash
      })
    })
  }, [account, addTransaction, nftContract])

  const deposit = useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')
    const method = 'deposit'
    console.log('🚀 ~ file: deposit.ts ~ line 18 ~ args', method)
    return contract.estimateGas[method]({ from: account }).then(estimatedGasLimit => {
      return contract[method]({
        gasLimit: calculateGasMargin(estimatedGasLimit),
        // gasLimit: '3500000',
        from: account
      }).then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Pledge NFT`
        })
        return response.hash
      })
    })
  }, [account, addTransaction, contract])

  const claimReward = useCallback(async () => {
    if (!account) throw new Error('none account')
    if (!contract) throw new Error('none contract')
    const method = 'claimReward'
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
    mint,
    balanceOfNFT,
    totalSupply,
    deposit,
    claimReward,
    additionalNFTPower,
    getNFTPendingReward
  }
}
