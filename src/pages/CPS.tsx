import { ContentView, Frame, LineDivider, PageWrapper, Tab, TabFrame, Text, Title } from './App'
import img2 from './img2.png'
import { useI18n } from 'react-simple-i18n'
import ActionButton from '../components/Button/ActionButton'
import { Box, Stack, styled } from '@mui/material'
import coin from './coin.png'
import { usePledgeReward } from '../hooks/usePledgeReward'
import { useCallback } from 'react'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from 'hooks'
import useModal from 'hooks/useModal'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { CurrencyAmount } from 'constants/token'
import { CPS as CPSToken } from '../constants'
import JSBI from 'jsbi'

const Coin = styled('img')`
  width: 21px;
  height: 21px;
`

const CenterFixedRow = styled(Stack)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`
export default function CPS() {
  const { t } = useI18n()
  const { chainId, account } = useActiveWeb3React()
  const { showModal, hideModal } = useModal()
  const { claim, claimableRewards, readyToUnlockBalance, honorValue, reffralIndex } = usePledgeReward()

  console.log(claimableRewards, readyToUnlockBalance)

  const claimReffraCallback = useCallback(() => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    claim()
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
  }, [account, claim, hideModal, showModal])
  const CPSTokenAmount = CPSToken[chainId ?? 56]
  const honorValueAmount = honorValue && CurrencyAmount.fromRawAmount(CPSTokenAmount, JSBI.BigInt(honorValue))
  const claimableRewardsCurencyAmount =
    CPSTokenAmount && claimableRewards && CurrencyAmount.fromRawAmount(CPSTokenAmount, JSBI.BigInt(claimableRewards))
  const PendingReffrReward =
    reffralIndex &&
    readyToUnlockBalance &&
    CPSTokenAmount &&
    CurrencyAmount.fromRawAmount(
      CPSTokenAmount,
      JSBI.subtract(JSBI.BigInt(readyToUnlockBalance), JSBI.BigInt(reffralIndex))
    )
  const [approvalState0, approveCallback0] = useApproveCallback(claimableRewardsCurencyAmount, CPSTokenAmount?.address)
  console.log(approvalState0, approveCallback0)

  return (
    <PageWrapper style={{ marginTop: 0 }}>
      <TabFrame gap={10}>
        <Tab>CPS协议</Tab>
        <Tab>CPS文档</Tab>
      </TabFrame>
      <Frame>
        <img src={img2} style={{ width: 91, margin: 'auto' }} />
        <Title style={{ fontSize: 16 }}>{t('text37')}</Title>
        <LineDivider />
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text38')}</Text>
          </CenterFixedRow>
          <Text>{PendingReffrReward?.toSignificant() || '0'}</Text>
        </ContentView>
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text39')}</Text>
          </CenterFixedRow>
          <Text>{claimableRewardsCurencyAmount?.toSignificant() || '0'}</Text>
        </ContentView>
        <ContentView>
          <CenterFixedRow>
            <Text>{t('text39')}</Text>
          </CenterFixedRow>
          <Text>{honorValueAmount?.toSignificant() || '0'}</Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton onAction={claimReffraCallback} actionText={t('text36')} />
        </Box>
      </Frame>
      <Frame>
        <img src={img2} style={{ width: 91, margin: 'auto' }} />
        <Title style={{ fontSize: 16 }}>{t('text37')}</Title>
        <LineDivider />
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text38')}</Text>
          </CenterFixedRow>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text39')}</Text>
          </CenterFixedRow>
          <Text>0</Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton onAction={() => {}} actionText={t('text36')} />
        </Box>
      </Frame>
      <Frame>
        <img src={img2} style={{ width: 91, margin: 'auto' }} />
        <Title style={{ fontSize: 16 }}>{t('text37')}</Title>
        <LineDivider />
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text38')}</Text>
          </CenterFixedRow>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text39')}</Text>
          </CenterFixedRow>
          <Text>0</Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton onAction={() => {}} actionText={t('text36')} />
        </Box>
      </Frame>
      <Stack
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 500,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '35px auto 0',
          lineHeight: 1.5,
          padding: '0 60px 80px',
          '& p': {
            lineHeight: 1.5,
            margin: 'auto'
          }
        }}
      >
        <Text mt={10}>{t('text128')}</Text>
      </Stack>
    </PageWrapper>
  )
}
