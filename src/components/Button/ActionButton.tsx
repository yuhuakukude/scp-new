import { Button } from '@mui/material'
import Spinner from 'components/Spinner'
import { Typography } from '@mui/material'
import { OutLineButton } from './index'
import { useI18n } from 'react-simple-i18n'

export default function ActionButton({
  error,
  pending,
  success,
  onAction,
  actionText,
  pendingText,
  height,
  width,
  disableAction,
  successText,
  outLine
}: {
  error?: string | undefined
  pending?: boolean
  success?: boolean
  onAction: (() => void) | undefined
  actionText: string
  pendingText?: string
  successText?: string
  height?: string
  width?: string
  disableAction?: boolean
  outLine?: boolean
}) {
  const { t } = useI18n()
  return (
    <>
      {error || pending ? (
        <OutLineButton color="primary" disabled sx={{ height, width }}>
          {pending ? (
            <>
              <Spinner marginRight={16} />
              {pendingText || t('text67')}
            </>
          ) : (
            error
          )}
        </OutLineButton>
      ) : success ? (
        <Button disabled sx={{ height, width }}>
          <Typography variant="inherit">{successText ?? actionText}</Typography>
        </Button>
      ) : outLine ? (
        <OutLineButton sx={{ height, width }} onClick={onAction} disabled={disableAction}>
          {actionText}
        </OutLineButton>
      ) : (
        <Button sx={{ height, width }} onClick={onAction} disabled={disableAction}>
          {actionText}
        </Button>
      )}
    </>
  )
}
