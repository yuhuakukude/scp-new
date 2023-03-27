import { ContentView, Frame, LineDivider, Title } from '../App'
import { splitSignature } from '@ethersproject/bytes'
import { useI18n } from 'react-simple-i18n'
import { Box, Stack, Typography } from '@mui/material'
import CurrencyInputPanel from '../../components/Input/CurrencyInputPanel'
import { CPS, LIQUIDITY_TOKEN, ROUTER_ADDRESS, USDT } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import add from '../../assets/images/add.png'
import bg from './long_bg.png'
import ActionButton from '../../components/Button/ActionButton'
import { useTotalSupply } from '../../data/TotalSupply'
import { usePairContract, useRouterContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { CurrencyAmount, Price } from '../../constants/token'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useCallback, useMemo, useState } from 'react'
import { tryParseAmount } from '../../utils/parseAmount'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { calculateGasMargin, calculateSlippageAmount } from '../../utils'
import { useTransactionDeadline } from '../../hooks/useTransactionDeadline'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TransactionResponse } from '@ethersproject/providers'

enum TYPE {
  USDT_INPUT = 'TOP_INPUT',
  CPS_INPUT = 'BOTTOM_INPUT'
}

export default function Liquidity() {
  const { chainId, account, library } = useActiveWeb3React()
  const { t } = useI18n()
  const [typed, setType] = useState('')
  const [typedRemove, setTypeRemove] = useState('')
  const [typedType, setTypedType] = useState<TYPE>(TYPE.USDT_INPUT)
  const chainUSDT = USDT[chainId ?? 56]
  const chainCPS = CPS[chainId ?? 56]
  const chainLiquidityToken = LIQUIDITY_TOKEN[chainId ?? 56]
  const [allowedSlippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()
  const addTransaction = useTransactionAdder()
  const totalSupply = useTotalSupply(chainLiquidityToken)
  const pairContract = usePairContract(chainLiquidityToken?.address)
  const routerContract = useRouterContract(ROUTER_ADDRESS[chainId ?? 56])
  const reserves = useSingleCallResult(pairContract, 'getReserves')?.result
  const reserveUSDT =
    chainUSDT && chainCPS && reserves
      ? chainUSDT?.sortsBefore(chainCPS)
        ? reserves.reserve0.toString()
        : reserves.reserve1.toString()
      : undefined
  const reserveCPS =
    chainUSDT && chainCPS && reserves
      ? !chainUSDT?.sortsBefore(chainCPS)
        ? reserves.reserve0.toString()
        : reserves.reserve1.toString()
      : undefined
  const priceUSDT = useMemo(
    () =>
      chainUSDT && chainCPS && reserveCPS && reserveCPS
        ? new Price(chainUSDT, chainCPS, reserveUSDT, reserveCPS)
        : undefined,
    [chainCPS, chainUSDT, reserveCPS, reserveUSDT]
  )

  const priceCPS = useMemo(
    () =>
      chainUSDT && chainCPS && reserveCPS && reserveCPS
        ? new Price(chainCPS, chainUSDT, reserveCPS, reserveUSDT)
        : undefined,
    [chainCPS, chainUSDT, reserveCPS, reserveUSDT]
  )

  const removeAmount = tryParseAmount(typedRemove, chainLiquidityToken)

  const formattedAmounts = useMemo(() => {
    const usdtAmount = tryParseAmount(typed, chainUSDT)
    const cpsAmount = tryParseAmount(typed, chainCPS)

    return typedType === TYPE.USDT_INPUT
      ? { usdtValue: typed, cpsValue: usdtAmount ? priceUSDT?.quote(usdtAmount).toExact() ?? '' : '' }
      : { usdtValue: cpsAmount ? priceCPS?.quote(cpsAmount).toExact() ?? '' : '', cpsValue: typed }
  }, [chainCPS, chainUSDT, priceCPS, priceUSDT, typed, typedType])

  const usdtAmount = tryParseAmount(formattedAmounts.usdtValue, chainUSDT)
  const cpsAmount = tryParseAmount(formattedAmounts.cpsValue, chainCPS)
  const usdtBalance = useCurrencyBalance(account ?? undefined, chainUSDT)
  const cpsBalance = useCurrencyBalance(account ?? undefined, chainCPS)
  const lpBalance = useCurrencyBalance(account ?? undefined, chainLiquidityToken)

  const invalidLiquidityInput = useMemo(() => {
    return !(!lpBalance || !removeAmount || lpBalance.lessThan(removeAmount))
  }, [lpBalance, removeAmount])

  const invalidInput = useMemo(() => {
    return !(
      !usdtAmount ||
      !usdtBalance ||
      !cpsAmount ||
      !cpsBalance ||
      usdtBalance.lessThan(usdtAmount) ||
      cpsBalance.lessThan(cpsAmount)
    )
  }, [cpsAmount, cpsBalance, usdtAmount, usdtBalance])

  const [approvalUSDT, approveUSDTCallback] = useApproveCallback(usdtAmount, ROUTER_ADDRESS[chainId ?? 56])
  const [approvalCPS, approveCPSCallback] = useApproveCallback(cpsAmount, ROUTER_ADDRESS[chainId ?? 56])
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approvalLiquidity, approveLiquidityCallback] = useApproveCallback(removeAmount, ROUTER_ADDRESS[chainId ?? 56])
  const liquidityValueUsdt =
    totalSupply &&
    removeAmount &&
    reserveUSDT &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, removeAmount.raw)
      ? JSBI.divide(JSBI.multiply(removeAmount.raw, JSBI.BigInt(reserveUSDT)), totalSupply.raw)
      : undefined

  const liquidityValueCPS =
    totalSupply &&
    removeAmount &&
    reserveCPS &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, removeAmount.raw)
      ? JSBI.divide(JSBI.multiply(removeAmount.raw, JSBI.BigInt(reserveCPS)), totalSupply.raw)
      : undefined

  const addCallback = useCallback(() => {
    if (!chainId || !library || !account || !routerContract || !deadline) return

    if (!usdtAmount || !cpsAmount) {
      return
    }

    const usdtAmountMin = calculateSlippageAmount(usdtAmount, 100)[0]
    const cpsAmountMin = calculateSlippageAmount(cpsAmount, 100)[0]

    const estimate = routerContract.estimateGas.addLiquidity
    const method = routerContract.addLiquidity
    const args = [
      chainUSDT.address,
      chainCPS?.address,
      usdtAmount.raw.toString(),
      cpsAmount.raw.toString(),
      usdtAmountMin.toString(),
      cpsAmountMin.toString(),
      account,
      deadline.toHexString()
    ]

    estimate(...args)
      .then(estimatedGasLimit =>
        method(...args, {
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then((response: any) => {
          addTransaction(response, {
            summary:
              'Add ' + usdtAmount?.toSignificant(3) + ' ' + 'USDT' + ' and ' + cpsAmount?.toSignificant(3) + ' ' + 'CPS'
          })
        })
      )
      .catch(error => {
        console.log(error)
      })
  }, [account, addTransaction, chainCPS, chainId, chainUSDT, cpsAmount, deadline, library, routerContract, usdtAmount])

  async function onAttemptToApprove() {
    if (!pairContract || !chainLiquidityToken || !library || !deadline) throw new Error('missing dependencies')
    if (!removeAmount) throw new Error('missing liquidity amount')

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Pancake LPs',
      version: '1',
      chainId: chainId,
      verifyingContract: chainLiquidityToken.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS[chainId ?? 56],
      value: removeAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    return library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        console.log('error', error)
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveLiquidityCallback()
        } else {
        }
      })
  }

  const removeCallback = useCallback(async () => {
    if (!chainId || !library || !account || !deadline || !removeAmount || !routerContract || !chainUSDT || !chainCPS)
      throw new Error('missing dependencies')
    if (!liquidityValueUsdt || !liquidityValueCPS) {
      throw new Error('missing currency amounts')
    }

    const usdtLiquidityAmountMin = calculateSlippageAmount(
      CurrencyAmount.fromRawAmount(chainUSDT, liquidityValueUsdt),
      allowedSlippage
    )[0]
    const cpsLiquidityAmountMin = calculateSlippageAmount(
      CurrencyAmount.fromRawAmount(chainCPS, liquidityValueCPS),
      allowedSlippage
    )[0]

    let methodNames: string[], args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity

    if (approvalLiquidity === ApprovalState.APPROVED) {
      // removeLiquidity
      methodNames = ['removeLiquidity']
      args = [
        chainUSDT.address,
        chainCPS.address,
        removeAmount.raw.toString(),
        usdtLiquidityAmountMin.toString(),
        cpsLiquidityAmountMin.toString(),
        account,
        deadline.toHexString()
      ]
    }
    // we have a signataure, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      methodNames = ['removeLiquidityWithPermit']
      args = [
        chainUSDT.address,
        chainCPS.address,
        removeAmount.raw.toString(),
        usdtLiquidityAmountMin.toString(),
        cpsLiquidityAmountMin.toString(),
        account,
        signatureData.deadline,
        false,
        signatureData.v,
        signatureData.r,
        signatureData.s
      ]
    } else {
      throw new Error('Attempting to confirm without approval or a signature. Please contact support.')
    }
    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map(methodName =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch(error => {
            console.error(`estimateGas failed`, methodName, args, error)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
      BigNumber.isBigNumber(safeGasEstimate)
    )
    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate
      })
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Withdraw ' + removeAmount.toSignificant(6) + 'LP'
          })
        })
        .catch((error: Error) => {
          console.log(error)
        })
    }
  }, [
    account,
    addTransaction,
    allowedSlippage,
    approvalLiquidity,
    chainCPS,
    chainId,
    chainUSDT,
    deadline,
    library,
    liquidityValueCPS,
    liquidityValueUsdt,
    removeAmount,
    routerContract,
    signatureData
  ])

  return (
    <Frame bg={bg}>
      <Title>{t('text47')}</Title>
      <Typography mt={12} fontSize={12} textAlign={'center'} fontWeight={400}>
        {t('text48')}
      </Typography>
      <LineDivider />
      <Box mt={30}>
        <CurrencyInputPanel
          disableCurrencySelect
          currency={chainUSDT}
          value={formattedAmounts.usdtValue}
          onChange={e => {
            setTypedType(TYPE.USDT_INPUT)
            setType(e.target.value)
          }}
          onSelectCurrency={() => {}}
        />
      </Box>
      <Box m={20}>
        <img style={{ width: 25, height: 25, margin: 'auto' }} src={add} />
      </Box>
      <Box>
        <CurrencyInputPanel
          disableCurrencySelect
          currency={chainCPS}
          value={formattedAmounts.cpsValue}
          onChange={e => {
            setTypedType(TYPE.CPS_INPUT)
            setType(e.target.value)
          }}
          onSelectCurrency={() => {}}
        />
      </Box>
      <Stack spacing={20} sx={{ background: '#F2F5FA', borderTop: '1px solid #D1D5EC' }} p={'16px 11px'}>
        <Stack>
          <Typography fontSize={12} fontWeight={400}>
            {t('text51')}
          </Typography>
          <Typography mt={2} color={'#7742FF'} fontSize={12} fontWeight={400}>
            <span>{totalSupply?.toSignificant(6)}</span>0
          </Typography>
        </Stack>
        <Stack sx={{ background: '#F2F5FA' }}>
          <Typography fontSize={12} fontWeight={400}>
            {t('text24')}
          </Typography>
          <Typography mt={2} fontSize={12} fontWeight={400}>
            <span>1USDT={priceUSDT?.toSignificant(2)}CPS</span>
          </Typography>
        </Stack>
        <Stack sx={{ background: '#F2F5FA' }}>
          <Typography fontSize={12} fontWeight={400}>
            {t('text52')}
          </Typography>
          <Typography sx={{ span: { color: '#7742FF' } }} mt={2} fontSize={12} fontWeight={400}>
            <span>{reserveCPS ? CurrencyAmount.ether(reserveCPS).toSignificant(6) : '--'}</span>CPS/
            <span>{reserveUSDT ? CurrencyAmount.ether(reserveUSDT).toSignificant(6) : '--'}</span>USDT
          </Typography>
        </Stack>
      </Stack>

      <Box mt={16}>
        <Stack direction={'row'} gap={20} mb={20}>
          {approvalUSDT === ApprovalState.NOT_APPROVED || approvalUSDT === ApprovalState.PENDING ? (
            <ActionButton
              pending={approvalUSDT === ApprovalState.PENDING}
              pendingText={t('text56')}
              onAction={approveUSDTCallback}
              actionText={`${t('text55')} USDT`}
            />
          ) : null}

          {approvalCPS === ApprovalState.NOT_APPROVED || approvalCPS === ApprovalState.PENDING ? (
            <ActionButton
              pending={approvalCPS === ApprovalState.PENDING}
              pendingText={t('text56')}
              onAction={approveCPSCallback}
              actionText={`${t('text55')} CPS`}
            />
          ) : null}
        </Stack>
        <ActionButton disableAction={!invalidInput} onAction={addCallback} actionText={t('text53')} />
      </Box>
      <ContentView>
        <Typography fontSize={12} fontWeight={400}>
          {t('text54')}
        </Typography>
        <Typography fontSize={12}>
          <span style={{ color: '#7742FF' }}>{lpBalance ? lpBalance.toSignificant(6) : '--'}</span>LP
        </Typography>
      </ContentView>
      <Box mt={30}>
        <CurrencyInputPanel
          hideCurrency
          hideBalance
          disableCurrencySelect
          currency={LIQUIDITY_TOKEN[chainId ?? 56]}
          value={typedRemove}
          onChange={e => {
            setSignatureData(null)
            setTypeRemove(e.target.value)
          }}
          onSelectCurrency={() => {}}
        />
      </Box>
      <Box mt={20}>
        <ActionButton
          disableAction={approvalLiquidity === ApprovalState.APPROVED || signatureData !== null || !removeAmount}
          onAction={onAttemptToApprove}
          actionText={t('text55')}
        />
      </Box>
      <Box mt={20}>
        <ActionButton
          disableAction={
            !invalidLiquidityInput || !(approvalLiquidity === ApprovalState.APPROVED || signatureData !== null)
          }
          onAction={removeCallback}
          actionText={t('text57')}
        />
      </Box>
    </Frame>
  )
}
