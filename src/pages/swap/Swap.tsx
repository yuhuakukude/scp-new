import { ContentView, Divider, Frame, Title } from '../App'
import { Box, Typography } from '@mui/material'
import { useI18n } from 'react-simple-i18n'
import CurrencyInputPanel from '../../components/Input/CurrencyInputPanel'
import icon from './icon.png'
import { useCallback, useMemo, useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { CPS, LIQUIDITY_TOKEN, ROUTER_ADDRESS, USDT } from '../../constants'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { useTransactionDeadline } from '../../hooks/useTransactionDeadline'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { usePairContract, useRouterContract } from '../../hooks/useContract'
import { useSingleCallResult } from '../../state/multicall/hooks'
import { CurrencyAmount, Price } from '../../constants/token'
import { tryParseAmount } from '../../utils/parseAmount'
import { calculateGasMargin, calculateSlippageAmount } from '../../utils'
import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import ActionButton from '../../components/Button/ActionButton'
import bg from './long_bg.png'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useCurrencyBalance } from '../../state/wallet/hooks'

enum TYPE {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}
export default function Swap() {
  const { t } = useI18n()
  const { chainId, account, library } = useActiveWeb3React()
  const chainUSDT = USDT[chainId ?? 56]
  const chainCPS = CPS[chainId ?? 56]
  const [typed, setType] = useState('')
  const [inputToken, setInputToken] = useState(chainUSDT)
  const [outputToken, setOutputToken] = useState(chainCPS)
  const chainLiquidityToken = LIQUIDITY_TOKEN[chainId ?? 56]

  const [typedType, setTypedType] = useState<TYPE>(TYPE.INPUT)

  const [allowedSlippage] = useUserSlippageTolerance()
  const deadline = useTransactionDeadline()
  const addTransaction = useTransactionAdder()
  const pairContract = usePairContract(chainLiquidityToken?.address)
  const routerContract = useRouterContract(ROUTER_ADDRESS[chainId ?? 56])
  const inputBalance = useCurrencyBalance(account ?? undefined, inputToken)

  const reserves = useSingleCallResult(pairContract, 'getReserves')?.result
  const reserveInput =
    inputToken && outputToken && reserves
      ? inputToken?.sortsBefore(outputToken)
        ? reserves.reserve0.toString()
        : reserves.reserve1.toString()
      : undefined
  const reserveOutput =
    inputToken && outputToken && reserves
      ? !inputToken?.sortsBefore(outputToken)
        ? reserves.reserve0.toString()
        : reserves.reserve1.toString()
      : undefined
  const priceInput = useMemo(
    () =>
      inputToken && outputToken && reserveInput && reserveOutput
        ? new Price(inputToken, outputToken, reserveInput, reserveOutput)
        : undefined,
    [inputToken, outputToken, reserveInput, reserveOutput]
  )

  const priceOutput = useMemo(
    () =>
      inputToken && outputToken && reserveInput && reserveOutput
        ? new Price(outputToken, inputToken, reserveOutput, reserveInput)
        : undefined,
    [inputToken, outputToken, reserveInput, reserveOutput]
  )

  const formattedAmounts = useMemo(() => {
    const inputAmount = tryParseAmount(typed, inputToken)
    const outputAmount = tryParseAmount(typed, outputToken)

    return typedType === TYPE.INPUT
      ? { inputValue: typed, outputValue: inputAmount ? priceInput?.quote(inputAmount).toExact() ?? '' : '' }
      : { inputValue: outputAmount ? priceOutput?.quote(outputAmount).toExact() ?? '' : '', outputValue: typed }
  }, [inputToken, outputToken, priceInput, priceOutput, typed, typedType])

  const inputAmount = tryParseAmount(formattedAmounts.inputValue, inputToken)
  const outputAmount = tryParseAmount(formattedAmounts.outputValue, outputToken)

  const invalidInput = useMemo(() => {
    if (!inputBalance || !inputAmount || inputBalance.lessThan(inputAmount)) return false
    return true
  }, [inputAmount, inputBalance])

  const [approval, approveCallback] = useApproveCallback(inputAmount, ROUTER_ADDRESS[chainId ?? 56])

  const addCallback = useCallback(async () => {
    if (!chainId || !library || !account || !deadline || !routerContract || !chainUSDT || !chainCPS)
      throw new Error('missing dependencies')
    if (!inputAmount || !outputAmount) {
      throw new Error('missing currency amounts')
    }

    // const inputAmountMin = calculateSlippageAmount(
    //     CurrencyAmount.fromRawAmount(inputToken, inputAmount.raw),
    //     allowedSlippage
    // )[0]
    const outputAmountMin = calculateSlippageAmount(
      CurrencyAmount.fromRawAmount(outputToken, outputAmount.raw),
      allowedSlippage
    )[0]

    const methodNames = ['swapExactTokensForTokensSupportingFeeOnTransferTokens']
    const args = [
      inputAmount.raw.toString(),
      outputAmountMin.toString(),
      [inputToken.address, outputToken.address],
      account,
      deadline.toHexString()
    ]
    // we have a signataure, use permit versions of remove liquidity

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
            summary:
              'Swap ' +
              inputAmount.toSignificant(6) +
              inputToken.symbol +
              'to' +
              outputAmount.toSignificant(6) +
              outputToken.symbol
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
    chainCPS,
    chainId,
    chainUSDT,
    deadline,
    inputAmount,
    inputToken.address,
    inputToken.symbol,
    library,
    outputAmount,
    outputToken,
    routerContract
  ])

  return (
    <Frame bg={bg}>
      <Title>{t('text62')}</Title>
      <Typography textAlign={'center'} fontSize={12} mt={12} fontWeight={400}>
        {t('text63')}
      </Typography>
      <Divider />
      <Box mt={29}>
        <CurrencyInputPanel
          onChange={e => {
            setTypedType(TYPE.INPUT)
            setType(e.target.value)
          }}
          currency={inputToken}
          value={formattedAmounts.inputValue}
          onSelectCurrency={() => {}}
        />
      </Box>
      <Box m={20} sx={{ display: 'flex', justifyContent: 'center' }}>
        <img
          onClick={() => {
            if (inputToken === chainUSDT) {
              setInputToken(chainCPS)
              setOutputToken(chainUSDT)
            } else {
              setInputToken(chainUSDT)
              setOutputToken(chainCPS)
            }
          }}
          style={{ width: 40, height: 40 }}
          src={icon}
        />
      </Box>
      <CurrencyInputPanel
        onChange={e => {
          setTypedType(TYPE.OUTPUT)
          setType(e.target.value)
        }}
        currency={outputToken}
        value={formattedAmounts.outputValue}
        onSelectCurrency={() => {}}
      />
      <Box mt={30}>
        <ActionButton
          disableAction={(!inputAmount || !outputAmount || !invalidInput) && approval !== ApprovalState.NOT_APPROVED}
          pending={approval === ApprovalState.PENDING}
          onAction={approval === ApprovalState.NOT_APPROVED ? approveCallback : addCallback}
          actionText={approval === ApprovalState.NOT_APPROVED ? t('text55') : t('text65')}
        />
      </Box>
      <ContentView>
        <Typography fontSize={12} fontWeight={400}>
          {t('text24')}
        </Typography>
        <Typography fontSize={12} fontWeight={400}>
          1{inputToken.symbol} = <span style={{ color: '#7742FF' }}>{priceInput?.toSignificant(6) ?? ''}</span>{' '}
          {outputToken.symbol}
        </Typography>
      </ContentView>
    </Frame>
  )
}
