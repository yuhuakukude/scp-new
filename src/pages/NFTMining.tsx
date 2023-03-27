import { ContentView, Divider, Frame, PageWrapper, Text, Title } from './App'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useI18n } from 'react-simple-i18n'
import coin from './coin.png'
import icon1 from './icon1.png'
import img1 from './img1.png'
import ActionButton from '../components/Button/ActionButton'
import { tryParseAmount } from '../utils/parseAmount'
import { NFT, NFTMine_ADDRESS, USDT } from '../constants'
import { useActiveWeb3React } from '../hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useCallback, useMemo } from 'react'
import { ApprovalState, useApproveCallback } from '../hooks/useApproveCallback'
import TransactionPendingModal from '../components/Modal/TransactionModals/TransactionPendingModal'
import TransactionSubmittedModal from '../components/Modal/TransactionModals/TransactiontionSubmittedModal'
import MessageBox from '../components/Modal/TransactionModals/MessageBox'
import useModal from '../hooks/useModal'
import { useNftMine } from '../hooks/useNftMine'
import { useUserHasSubmittedRecords } from '../state/transactions/hooks'
import { useERC721ApproveAllCallback } from '../hooks/useERC721ApproveAllCallback'

export default function NFTMining() {
  const { t } = useI18n()
  const { showModal, hideModal } = useModal()
  const { chainId, account } = useActiveWeb3React()
  const chainUSDT = USDT[chainId ?? 56]
  const { mint, deposit, claimReward } = useNftMine()
  const { submitted } = useUserHasSubmittedRecords(account ?? undefined, 'mint')
  const payAmount = tryParseAmount('200', chainUSDT)
  const usdtBalance = useCurrencyBalance(account ?? undefined, chainUSDT)
  const [approval, approveCallback] = useApproveCallback(payAmount, NFT[chainId ?? 56].address)
  const [nftApproval, nftApproveCallback] = useERC721ApproveAllCallback(
    NFT[chainId ?? 56].address,
    NFTMine_ADDRESS[chainId ?? 56]
  )

  const invalid = useMemo(() => {
    return !(!usdtBalance || !payAmount || usdtBalance.lessThan(payAmount))
  }, [payAmount, usdtBalance])

  const mintCallback = useCallback(() => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    mint()
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
  }, [account, hideModal, mint, showModal])

  const depositCallback = useCallback(() => {
    if (!account) return
    showModal(<TransactionPendingModal />)
    deposit()
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
  }, [account, deposit, hideModal, showModal])

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

  return (
    <PageWrapper>
      <Typography textAlign={'center'} fontSize={20} m={30}>
        {t('text23')}
      </Typography>
      <Frame>
        <Stack direction={'row'} spacing={14} alignItems={'center'}>
          <img style={{ width: 30, height: 30 }} src={coin} />
          <Typography fontSize={20}>NFT</Typography>
        </Stack>
        <Typography mt={30}>{t('text24')}</Typography>
        <Stack mt={10} direction={'row'}>
          <Typography fontSize={20} color={'#7742FF'}>
            {200}
          </Typography>
          <Typography fontSize={20} ml={14}>
            USDT
          </Typography>
        </Stack>
        <Box mt={30}>
          {approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING || submitted ? (
            <ActionButton
              pending={approval === ApprovalState.PENDING || submitted}
              onAction={approveCallback}
              actionText={t('text55')}
            />
          ) : (
            <Button disabled={!invalid} onClick={mintCallback}>
              <img src={icon1} style={{ width: 12, marginRight: 4 }} />
              {t('text25')}
            </Button>
          )}
        </Box>

        <Box
          sx={{
            fontSize: 12,
            backgroundColor: '#F5F6FB',
            lineHeight: '44px',
            height: 44,
            color: '#7742FF',
            textAlign: 'center',
            marginTop: 8
          }}
        >
          http://www.cps.io/UID089234
        </Box>
        <Button sx={{ marginTop: 15 }}>{t('text21')}</Button>
        <img src={img1} style={{ position: 'absolute', width: 204, left: 264, marginTop: -80 }} />
      </Frame>
      <Frame>
        <Title>{t('text26')}</Title>
        <Divider />
        <ContentView>
          <Text>{t('text27')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text28')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text29')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text30')}</Text>
          <Text>0</Text>
        </ContentView>
      </Frame>
      <Frame>
        <Title>{t('text31')}</Title>
        <Divider />
        <ContentView>
          <Text>{t('text32')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text33')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Stack direction={'row'} alignItems={'center'}>
            <img style={{ width: 20, height: 20 }} src={coin} />
            <Text ml={8}>{t('text34')}</Text>
          </Stack>

          <Stack direction={'row'} alignItems={'center'}>
            <Text color={'#7742FF'} ml={8}>
              0
            </Text>
            <Text ml={2}>CPS</Text>
          </Stack>
        </ContentView>
        <Box mt={24}>
          <ActionButton
            pending={nftApproval === ApprovalState.PENDING}
            onAction={nftApproval === ApprovalState.NOT_APPROVED ? nftApproveCallback : depositCallback}
            actionText={nftApproval === ApprovalState.NOT_APPROVED ? t('text55') : t('text35')}
          />
        </Box>
        <Box mt={24}>
          <ActionButton outLine onAction={claimCallback} actionText={t('text36')} />
        </Box>
      </Frame>
    </PageWrapper>
  )
}
