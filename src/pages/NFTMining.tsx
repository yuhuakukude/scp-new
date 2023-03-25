import { ContentView, Divider, Frame, PageWrapper, Text, Title } from './App'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useI18n } from 'react-simple-i18n'
import coin from './coin.png'
import { OutLineButton } from '../components/Button'
import icon1 from './icon1.png'
import img1 from './img1.png'
import ActionButton from '../components/Button/ActionButton'

export default function NFTMining() {
  const { t } = useI18n()
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
            {300}
          </Typography>
          <Typography fontSize={20} ml={14}>
            USDT
          </Typography>
        </Stack>
        <OutLineButton style={{ marginTop: 30 }}>
          <img src={icon1} style={{ width: 12, marginRight: 2 }} />
          {t('text25')}
        </OutLineButton>
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
          <ActionButton onAction={() => {}} actionText={t('text35')} />
        </Box>
        <Box mt={24}>
          <ActionButton outLine onAction={() => {}} actionText={t('text36')} />
        </Box>
      </Frame>
    </PageWrapper>
  )
}
