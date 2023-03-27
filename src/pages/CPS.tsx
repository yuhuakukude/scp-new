import { ContentView, Frame, LineDivider, PageWrapper, Tab, TabFrame, Text, Title } from './App'
import img2 from './img2.png'
import { useI18n } from 'react-simple-i18n'
import ActionButton from '../components/Button/ActionButton'
import { Box, Stack, styled } from '@mui/material'
import coin from './coin.png'
import communityIcon from '../assets/images/communityIcon.png'
import { usePledgeReward } from '../hooks/usePledgeReward'
import { useLpmineRewardLockc } from '../hooks/useLpmineRewardLockc'
import { useNftRewardLockc } from '../hooks/useNftRewardLockc'
import { useCallback, useMemo } from 'react'
import TransactionPendingModal from 'components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from 'components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from 'components/Modal/TransactionModals/MessageBox'
import { useActiveWeb3React } from 'hooks'
import useModal from 'hooks/useModal'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { CurrencyAmount } from 'constants/token'
import { CPS as CPSToken, LIQUIDITY_TOKEN, NFT_TOKEN } from '../constants'
import JSBI from 'jsbi'
import arrow from '../assets/images/arrow.png'
import bg from '../assets/images/bg.png'

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
  const { lpMineClaim, claimableLpMineLockRewards, readyToUnlockLpMineBalance } = useLpmineRewardLockc()
  const { nFtMineClaim, claimableNftMineLockRewards, readyToUnlockNftMineBalance } = useNftRewardLockc()

  const claimNftCallback = useCallback(() => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    nFtMineClaim()
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
  }, [account, hideModal, nFtMineClaim, showModal])

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
  const claimLpMineCallback = useCallback(() => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    lpMineClaim()
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
  }, [account, hideModal, lpMineClaim, showModal])
  const CPSTokenAmount = CPSToken[chainId ?? 56]
  const chainLiquidityToken = LIQUIDITY_TOKEN[chainId ?? 56]
  const NFTToken = NFT_TOKEN[chainId ?? 56]
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
  console.log(approvalState0)

  const claimableLpMineLockRewardsAmount =
    claimableLpMineLockRewards &&
    chainLiquidityToken &&
    CurrencyAmount.fromRawAmount(chainLiquidityToken, JSBI.BigInt(claimableLpMineLockRewards))
  const pendingLpMineLockBalanceAmount =
    chainLiquidityToken &&
    readyToUnlockLpMineBalance &&
    claimableLpMineLockRewards &&
    CurrencyAmount.fromRawAmount(
      chainLiquidityToken,
      JSBI.subtract(JSBI.BigInt(readyToUnlockLpMineBalance), JSBI.BigInt(claimableLpMineLockRewards))
    )
  const [approvalState1, approveCallback1] = useApproveCallback(
    claimableLpMineLockRewardsAmount,
    chainLiquidityToken?.address
  )
  console.log(approvalState1, approveCallback1)

  const claimableNftMineLockRewardsAmount = useMemo(() => {
    return (
      NFTToken &&
      claimableNftMineLockRewards &&
      CurrencyAmount.fromRawAmount(NFTToken, JSBI.BigInt(claimableNftMineLockRewards))
    )
  }, [NFTToken, claimableNftMineLockRewards])

  const pendingNftMineLockBalanceAmount =
    NFTToken &&
    readyToUnlockNftMineBalance &&
    claimableNftMineLockRewards &&
    CurrencyAmount.fromRawAmount(
      NFTToken,
      JSBI.subtract(JSBI.BigInt(readyToUnlockNftMineBalance), JSBI.BigInt(claimableNftMineLockRewards))
    )
  const [approvalState2, approveCallback2] = useApproveCallback(claimableNftMineLockRewardsAmount, NFTToken?.address)
  console.log(approvalState2, approveCallback2)
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
            <Text>{t('text125')}</Text>
          </CenterFixedRow>
          <Text>{honorValueAmount?.toSignificant() || '0'}</Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton
            pendingText={t('text56')}
            disableAction={approvalState0 === ApprovalState.PENDING || !claimableRewardsCurencyAmount?.greaterThan('0')}
            onAction={approvalState0 === ApprovalState.NOT_APPROVED ? approveCallback0 : claimReffraCallback}
            actionText={approvalState0 === ApprovalState.NOT_APPROVED ? t('text36') : t('text55')}
          />
        </Box>
      </Frame>
      <Frame>
        <img src={img2} style={{ width: 91, margin: 'auto' }} />
        <Title style={{ fontSize: 16 }}>{t('text126')}</Title>

        <LineDivider />
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text38')}</Text>
          </CenterFixedRow>
          <Text>{pendingLpMineLockBalanceAmount?.toSignificant() || '0'}</Text>
        </ContentView>
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text39')}</Text>
          </CenterFixedRow>
          <Text>{claimableLpMineLockRewardsAmount?.toSignificant() || '0'}</Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton
            pendingText={t('text56')}
            disableAction={
              approvalState1 === ApprovalState.PENDING || !claimableLpMineLockRewardsAmount?.greaterThan('0')
            }
            onAction={approvalState1 === ApprovalState.NOT_APPROVED ? approveCallback1 : claimLpMineCallback}
            actionText={approvalState1 === ApprovalState.NOT_APPROVED ? t('text36') : t('text55')}
          />
        </Box>
      </Frame>
      <Frame>
        <img src={img2} style={{ width: 91, margin: 'auto' }} />
        <Title style={{ fontSize: 16 }}>{t('text127')}</Title>
        <LineDivider />
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text38')}</Text>
          </CenterFixedRow>
          <Text>{pendingNftMineLockBalanceAmount?.toSignificant() || '0'}</Text>
        </ContentView>
        <ContentView>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text>{t('text39')}</Text>
          </CenterFixedRow>
          <Text>{claimableNftMineLockRewardsAmount?.toSignificant() || '0'}</Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton
            pendingText={t('text56')}
            disableAction={
              approvalState2 === ApprovalState.PENDING || !claimableNftMineLockRewardsAmount?.greaterThan('0')
            }
            onAction={approvalState2 === ApprovalState.NOT_APPROVED ? approveCallback2 : claimNftCallback}
            actionText={approvalState2 === ApprovalState.NOT_APPROVED ? t('text36') : t('text55')}
          />
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
          padding: '0 0 80px',
          '& p': {
            lineHeight: 1.5,
            margin: 'auto'
          }
        }}
      >
        <ContentView>
          <CenterFixedRow>
            <img width={40} src={communityIcon} />
            <Text textAlign={'left'} width={'100%'} sx={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 20, fontWeight: 800 }}>{t('text134')}</span>
              <span>{t('text135')}：2023.12.14 14：15：00</span>
            </Text>
          </CenterFixedRow>
        </ContentView>
        <ContentView
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            '& p': {
              lineHeight: 4,
              textAlign: 'left',
              width: '100%',
              margin: 0
            }
          }}
        >
          <Text>{t('text129')}</Text>
          <Text>{t('text130')}</Text>
          <Text>{t('text131')}</Text>
          <Stack
            sx={{
              height: 121,
              backgroundImage: `url(${bg})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              marginTop: 30,
              padding: '24px'
            }}
          >
            <CenterFixedRow>
              <Text
                textAlign={'left'}
                width={'100%'}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#fff',
                  '& span': { textAlign: 'left', width: '100%', lineHeight: 2 }
                }}
              >
                <span>{t('text132')}</span>
                <span style={{ fontSize: 20, fontWeight: 800 }}>{t('text133')}</span>
              </Text>
              <img width={40} src={arrow} />
            </CenterFixedRow>
          </Stack>
        </ContentView>
      </Stack>
    </PageWrapper>
  )
}
