import { Frame, PageWrapper, Tab, TabFrame, Title } from './App'
import { useI18n } from 'react-simple-i18n'
import { Box, Button, Typography } from '@mui/material'

export default function Inviter() {
  const { t } = useI18n()
  return (
    <PageWrapper>
      <TabFrame gap={10}>
        <Tab>{t('text58')}</Tab>
        <Tab>{t('text59')}</Tab>
      </TabFrame>
      <Frame>
        <Title>{t('text60')}</Title>
        <Typography>{t('text61')}</Typography>
        <Box mt={24} sx={{ height: 44, backgroundColor: '#F5F6FB' }}>
          <Typography lineHeight={'44px'} textAlign={'center'}>
            111111
          </Typography>
        </Box>
        <Box mt={15}>
          <Button>{t('text21')}</Button>
        </Box>
      </Frame>
    </PageWrapper>
  )
}
