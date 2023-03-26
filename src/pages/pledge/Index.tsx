import { ButtonGroup, Stack, styled, Button as MuiButton, Box } from '@mui/material'
import { ContentView, Frame, PageWrapper, Title, Text } from '../App'
import bg from '../swap/long_bg.png'
import coin from '../coin.png'
import tether from '../../assets/images/Tether.png'
import { LIQUIDITY_TOKEN, LPMine_ADDRESS } from '../../constants'
import CurrencyInputPanel from '../../components/Input/CurrencyInputPanel'
import { useCallback, useMemo, useState } from 'react'
import { tryParseAmount } from 'utils/parseAmount'
import { useActiveWeb3React } from 'hooks'
import ActionButton from '../../components/Button/ActionButton'
import { useI18n } from 'react-simple-i18n'
import { usePledge } from '../../hooks/usePledge'
import { usePledgeReward } from '../../hooks/usePledgeReward'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import useModal from 'hooks/useModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useCurrencyBalance } from 'state/wallet/hooks'
// import JSBI from 'jsbi'

const Coin = styled('img')`
  width: 21px;
  height: 21px;
`

const CenterFixedRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  gap: 10,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  '& button': {
    width: '30%',
    color: '#7742ff',
    fontWeight: 600,
    outline: 'none',
    borderColor: '#7742ff',
    borderRadius: 5,
    '&.active': {
      borderColor: '#7742ff',
      backgroundColor: '#7742ff',
      color: theme.palette.common.white
    }
  },
  '& button.MuiButtonGroup-grouped:not(:last-of-type)': {
    borderRadius: 5,
    borderColor: '#7742ff'
  },
  '& button.MuiButtonGroup-grouped:not(:first-of-type)': {
    borderRadius: 5
  },
  '& button:nth-child(4)': {
    width: '100%'
  }
}))

export default function Index() {
  const { t } = useI18n()
  const periodTypes = ['1', '2', '3', '0']
  const { claimableRewards, readyToUnlockBalance } = usePledgeReward()
  const { chainId, account } = useActiveWeb3React()
  const { balanceOfPledge, lpAmount, unlockTime, deposit, withdraw, claimReward, pendingReward, totalPledgeAmount } =
    usePledge()
  const [pledgeValue, setPledgeValue] = useState('')
  const chainLiquidityToken = LIQUIDITY_TOKEN[chainId ?? 56]
  const [balanceCanWithdraw, setBalanceCanWithdraw] = useState('')
  const [period, setPeriod] = useState('1')
  const [periodTime, setPeriodTime] = useState('7776000000')
  const { showModal, hideModal } = useModal()
  const balanceAmount = useCurrencyBalance(account ?? undefined, chainLiquidityToken)
  const totalPledgeTokenAmount = tryParseAmount(totalPledgeAmount, chainLiquidityToken)
  // const pledgedAmount = tryParseAmount(lpAmount.toString(), chainLiquidityToken)
  const inputAmount = tryParseAmount(pledgeValue, chainLiquidityToken || undefined)
  const [approvalState, approveCallback] = useApproveCallback(inputAmount, LPMine_ADDRESS[chainId ?? 56])
  const withdrawAmount = tryParseAmount(pendingReward?.toString(), chainLiquidityToken)
  const releaseTime = useMemo(() => {
    if (!periodTime || !unlockTime) return
    const sec = Math.abs(Number(unlockTime + periodTime))
    const days = Math.floor(sec / 86400000) || 0
    const hours = Math.floor(sec / 86400000 / 24 / 3600) || 0
    const mins = Math.ceil(sec / 86400000 / 24 / 3600 / 60) || 0
    return `${days} : ${hours} : ${mins}`
  }, [periodTime, unlockTime])

  console.log(approvalState, claimableRewards, readyToUnlockBalance, totalPledgeTokenAmount)

  const withdrawCallback = useCallback(() => {
    if (!account || !withdrawAmount) return
    showModal(<TransactionPendingModal />)
    withdraw(withdrawAmount)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [account, hideModal, showModal, withdraw, withdrawAmount])

  const claimCallback = useCallback(() => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    claimReward()
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [account, claimReward, hideModal, showModal])

  const depositCallback = useCallback(() => {
    if (!account || !inputAmount) return
    showModal(<TransactionPendingModal />)
    deposit('0x2F3E3281ac47bc1E313BAA5EdAB5C9d7a3aE9366', inputAmount, period)
      .then(() => {
        hideModal()
        showModal(<TransactionSubmittedModal />)
      })
      .catch((err: any) => {
        hideModal()
        showModal(
          <MessageBox type="error">{err.error && err.error.message ? err.error.message : err?.message}</MessageBox>
        )
        console.error(err)
      })
  }, [account, deposit, hideModal, inputAmount, period, showModal])
  return (
    <PageWrapper>
      <Frame bg={bg}>
        <Title>
          <Coin src={tether} />
          <Coin src={coin} />
          CPS-LP{t('text100')}
        </Title>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Text>{t('text101')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>{pendingReward?.toString() ?? ''}</span>
            <span> CPS</span>
          </Text>
        </ContentView>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Text>{t('text102')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>{totalPledgeAmount?.toString() ?? '-'}</span>
            <span> Lp</span>
          </Text>
        </ContentView>

        <CurrencyInputPanel
          placeholder="Clear Input Amount (USDT/CPS)"
          onChange={e => {
            setPledgeValue(e.target.value)
          }}
          currency={chainLiquidityToken}
          value={pledgeValue}
          onSelectCurrency={() => {}}
          onMax={() => {
            if (balanceAmount) {
              setPledgeValue(balanceAmount?.toSignificant().toString() ?? '')
            }
          }}
        />
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Text>{t('text104')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>{balanceOfPledge?.toString() ?? '-'}</span>
            <span> LP</span>
          </Text>
        </ContentView>
        <Text mt={20}>{t('text105')}</Text>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <StyledButtonGroup>
              <MuiButton
                className={period === periodTypes[0] ? 'active' : ''}
                onClick={() => {
                  setPeriod('1')
                  setPeriodTime('7776000000')
                }}
              >
                {t('text106')}
              </MuiButton>
              <MuiButton
                className={period === periodTypes[1] ? 'active' : ''}
                onClick={() => {
                  setPeriod('2')
                  setPeriodTime('12960000000')
                }}
              >
                {t('text107')}
              </MuiButton>
              <MuiButton
                className={period === periodTypes[2] ? 'active' : ''}
                onClick={() => {
                  setPeriod('3')
                  setPeriodTime('18144000000')
                }}
              >
                {t('text108')}
              </MuiButton>
              <MuiButton
                className={period === periodTypes[3] ? 'active' : ''}
                onClick={() => {
                  setPeriod('0')
                  setPeriodTime('0')
                }}
              >
                {t('text109')}
              </MuiButton>
            </StyledButtonGroup>
          </CenterFixedRow>
        </ContentView>
        <Box mt={20}>
          <ActionButton
            pendingText={t('text56')}
            onAction={approvalState === ApprovalState.NOT_APPROVED ? approveCallback : depositCallback}
            actionText={approvalState === ApprovalState.NOT_APPROVED ? t('text55') : t('text110')}
          />
        </Box>
        <ContentView alignItems={'center'} mt={20}>
          <CenterFixedRow>
            <Text>{t('text111')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>{lpAmount?.toString() ?? '-'}</span>
            <span> LP</span>
          </Text>
        </ContentView>
        <ContentView alignItems={'center'} mt={20}>
          <CenterFixedRow>
            <Text>{t('text112')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>{releaseTime ?? '00:00:00'}</span>
            <span></span>
          </Text>
        </ContentView>
        <CenterFixedRow
          mt={20}
          sx={{
            gap: 10,
            alignItems: 'end',
            '& .css-13dpkcn': {
              width: '90%'
            },
            '& button': {
              fontSize: 12
            }
          }}
        >
          <CurrencyInputPanel
            placeholder={t('text113')}
            onChange={e => {
              setBalanceCanWithdraw(e.target.value)
            }}
            currency={chainLiquidityToken}
            value={balanceCanWithdraw || ''}
            onSelectCurrency={() => {}}
            onMax={() => {
              if (balanceAmount) {
                setBalanceCanWithdraw(balanceAmount?.toSignificant().toString() ?? '')
              }
            }}
          />
          <ActionButton width={'100px'} onAction={withdrawCallback} actionText={t('text114')} />
        </CenterFixedRow>
        <ContentView alignItems={'center'} mt={20}>
          <Text sx={{ color: '#000', fontWeight: 800 }}>{t('text115')}</Text>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>{pendingReward?.toString() || '-'}</span>
            <span> CPS</span>
          </Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton onAction={claimCallback} actionText={t('text116')} />
        </Box>
      </Frame>
      <Stack
        sx={{
          width: 'calc(100% -60px)',
          maxWidth: 500,
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '0 30px 0',
          padding: '0 60px 80px'
        }}
      >
        <Text lineHeight={1.5}>{t('text117')}</Text>
      </Stack>
    </PageWrapper>
  )
}
