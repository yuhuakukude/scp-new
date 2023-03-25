import { ButtonGroup, Stack, styled, Button as MuiButton, Box } from '@mui/material'
import { ContentView, Frame, PageWrapper, Title, Text } from '../App'
import bg from '../swap/long_bg.png'
import coin from '../coin.png'
import tether from '../../assets/images/Tether.png'
import { LIQUIDITY_TOKEN } from '../../constants'
import CurrencyInputPanel from '../../components/Input/CurrencyInputPanel'
import { useMemo, useState } from 'react'
import { tryParseAmount } from 'utils/parseAmount'
import { useActiveWeb3React } from 'hooks'
import ActionButton from '../../components/Button/ActionButton'
import { useI18n } from 'react-simple-i18n'
import { usePledge } from '../../hooks/usePledge'

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
  const periodTypes = [t('text106'), t('text107'), t('text108'), t('text109')]
  const { chainId } = useActiveWeb3React()
  // const chainCPS = CPS[chainId ?? 56]
  const { lpAmount, unlockTime, deposit, withdraw, claimReward, pendingReward, totalPledgeAmount } = usePledge()
  const chainLiquidityToken = LIQUIDITY_TOKEN[chainId ?? 56]
  const [balanceCanWithdraw, setBalanceCanWithdraw] = useState('')
  // const [takeoutBalance, setTakeoutBalance] = useState('')
  // const [outputToken, setOutputToken] = useState(chainCPS)
  const [period, setPeriod] = useState(periodTypes[0])

  const formattedAmounts = useMemo(() => {
    const withdrawAmount = tryParseAmount(balanceCanWithdraw, chainLiquidityToken)
    // const takeoutAmount = tryParseAmount(takeoutBalance, outputToken)
    return {
      withdrawAmount
      // takeoutAmount
    }
  }, [balanceCanWithdraw, chainLiquidityToken])
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
            <span>{pendingReward}</span>
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
            <span>{totalPledgeAmount}</span>
            <span> Lp</span>
          </Text>
        </ContentView>

        <CurrencyInputPanel
          placeholder="Clear Input Amount (USDT/CPS)"
          onChange={e => {
            setBalanceCanWithdraw(e.target.value)
          }}
          currency={chainLiquidityToken}
          value={formattedAmounts.withdrawAmount?.toExact().toString() || ''}
          onSelectCurrency={() => {}}
          onMax={() => {}}
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
            <span>23135.54637</span>
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
                  setPeriod(periodTypes[0])
                }}
              >
                {t('text106')}
              </MuiButton>
              <MuiButton
                className={period === periodTypes[1] ? 'active' : ''}
                onClick={() => {
                  setPeriod(periodTypes[1])
                }}
              >
                {t('text107')}
              </MuiButton>
              <MuiButton
                className={period === periodTypes[2] ? 'active' : ''}
                onClick={() => {
                  setPeriod(periodTypes[2])
                }}
              >
                {t('text108')}
              </MuiButton>
              <MuiButton
                className={period === periodTypes[3] ? 'active' : ''}
                onClick={() => {
                  setPeriod(periodTypes[3])
                }}
              >
                {t('text109')}
              </MuiButton>
            </StyledButtonGroup>
          </CenterFixedRow>
        </ContentView>
        <Box mt={20}>
          <ActionButton onAction={() => {}} actionText={t('text110')} />
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
            <span>{lpAmount}</span>
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
            <span>23:59:59:99</span>
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
            value={formattedAmounts.withdrawAmount?.toExact().toString() || ''}
            onSelectCurrency={() => {}}
            onMax={() => {}}
          />
          <ActionButton width={'100px'} onAction={() => {}} actionText={t('text114')} />
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
            <span>23135.54637</span>
            <span> CPS</span>
          </Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton onAction={() => {}} actionText={t('text116')} />
        </Box>
      </Frame>
      <Stack
        sx={{
          width: 'calc(100% -60px)',
          maxWidth: 500,
          margin: '0 30px 0',
          padding: '0 60px 80px'
        }}
      >
        <Text>{t('text117')}</Text>
      </Stack>
    </PageWrapper>
  )
}
