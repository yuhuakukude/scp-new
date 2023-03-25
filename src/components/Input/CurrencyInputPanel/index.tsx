import { ChangeEvent } from 'react'
import { styled, Box, useTheme, Typography, Button } from '@mui/material'
import InputNumerical from 'components/Input/InputNumerical'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { Currency } from 'constants/token/currency'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import LogoText from '../../LogoText'
import { useI18n } from 'react-simple-i18n'

interface Props {
  currency?: Currency | null
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onMax?: () => void
  disabled?: boolean
  placeholder?: string
  selectActive?: boolean
  inputFocused?: boolean
  disableCurrencySelect?: boolean
  customBalanceText?: string
  hideBalance?: boolean
  onSelectCurrency: (cur: Currency) => void
}

const InputRow = styled('div')(() => ({
  position: 'relative',
  width: '100%',
  height: '44px',
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 11,
  '& .Mui-focused': {
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'calc(100% + 2px)',
      height: 'calc(100% + 2px)',
      margin: -1,
      border: '1px solid #D1D5EC',
      zIndex: 10000
    }
  }
}))

const StyledInput = styled(InputNumerical)({
  position: 'absolute'
})

const ButtonWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  right: 196,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    right: 20
  }
}))

export default function CurrencyInputPanel({
  onMax,
  value,
  disabled,
  placeholder,
  inputFocused,
  currency,
  customBalanceText,
  hideBalance,
  onChange
}: Props) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useTheme()
  const { t } = useI18n()

  return (
    <Box display="grid" gap="24px">
      <div>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {currency ? (
            <LogoText gapSize={'small'} logo={<CurrencyLogo currency={currency} />} text={currency.symbol} />
          ) : (
            <></>
          )}
          {currency && (
            <Typography color={theme.palette.text.primary} fontWeight={500} fontSize={12}>
              {!hideBalance && !!currency && selectedCurrencyBalance
                ? (customBalanceText ?? t('text50')) + selectedCurrencyBalance?.toSignificant(6)
                : ' -'}
            </Typography>
          )}
        </Box>
        <InputRow>
          <StyledInput
            placeholder={placeholder ?? t('text49')}
            value={value.toString()}
            onChange={onChange}
            type={'number'}
            disabled={disabled}
            focused={inputFocused}
          />
          {currency && onMax && (
            <ButtonWrapper>
              <Button variant="outlined" sx={{ width: '64px', height: '28px', borderRadius: '20px' }} onClick={onMax}>
                Max
              </Button>
            </ButtonWrapper>
          )}
        </InputRow>
      </div>
    </Box>
  )
}
