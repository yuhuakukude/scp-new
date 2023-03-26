import { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useTheme, Box, styled, Typography, Button } from '@mui/material'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
import useBreakpoint from 'hooks/useBreakpoint'
import { useI18n } from 'react-simple-i18n'

const ActionButton = styled(Button)(({ theme }) => ({
  fontSize: '14px',
  marginBottom: 15,
  [theme.breakpoints.down('sm')]: {
    maxWidth: 320,
    width: '100%',
    borderRadius: 49,
    marginBottom: 0
  }
}))

const AddressWrapper = styled(Box)`
  display: flex;
  align-items: center;
`
const Dot = styled('div')`
  background: #02b57e;
  width: 7px;
  height: 7px;
  margin-right: 6px;
`
const Address = styled(Typography)`
  color: #7742ff;
  font-size: 13px;
  font-weight: normal;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { t } = useI18n()
  const { account, error } = useWeb3React()
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  const isDownSm = useBreakpoint()

  if (account) {
    return (
      <Box
        sx={{ cursor: 'pointer', marginBottom: { xs: 0, sm: 15 }, mt: { xs: 0, sm: 8 } }}
        onClick={toggleWalletModal}
      >
        <Box
          sx={{
            padding: '0 20px',
            height: 33,
            borderRadius: '46px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid #02B57E'
          }}
        >
          <div />
          {hasPendingTransactions ? (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 10, sm: 17 }, ml: { xs: 10, sm: 20 } }}>
              <Spinner color={theme.palette.text.primary} size={isDownSm ? '10px' : '16px'} />
              <Box component="span" sx={{ ml: 3 }}>
                <Typography sx={{ fontSize: { xs: 9, sm: 14 }, ml: 8, color: theme.palette.text.primary }} noWrap>
                  {pending?.length} Pending
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: { xs: 9, sm: 14 },
                color: theme.palette.text.primary
              }}
            >
              {t('text64')}
            </Typography>
          )}
        </Box>
      </Box>
    )
  } else if (error) {
    return (
      <ActionButton
        sx={{
          width: isDownSm ? '128px' : '140px',
          height: isDownSm ? '28px' : '36px',
          fontSize: isDownSm ? '12px' : '14px'
        }}
        onClick={toggleWalletModal}
      >
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </ActionButton>
    )
  } else {
    return (
      <ActionButton
        sx={{
          width: isDownSm ? '128px' : '140px',
          height: isDownSm ? '28px' : '36px',
          fontSize: isDownSm ? '12px' : '14px'
        }}
        onClick={toggleWalletModal}
      >
        Connect Wallet
      </ActionButton>
    )
  }
}

export default function Web3Status({ showAddress }: { showAddress?: boolean }) {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      {showAddress && account ? (
        <AddressWrapper>
          <Dot />
          <Address>{shortenAddress(account)}</Address>
        </AddressWrapper>
      ) : (
        <>{!showAddress && <Web3StatusInner />}</>
      )}
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}
