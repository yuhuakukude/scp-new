import { Stack } from '@mui/material'
import footerIcon from '../../src/assets/images/footerIcon.png'

export default function Footer() {
  return (
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
        margin: '0 auto 0',
        lineHeight: 1.5,
        padding: '0 60px 80px',
        '& img': {
          margin: 'auto'
        },
        '& p': {
          marginTop: 10
        }
      }}
    >
      <img width={32} src={footerIcon} alt="" />
      <p>Copyright © 2023CPS</p>
    </Stack>
  )
}
