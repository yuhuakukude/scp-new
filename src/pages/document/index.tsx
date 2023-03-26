import { Box, Stack, styled } from '@mui/material'
import { useI18n } from 'react-simple-i18n'
import { ContentView, Divider, PageWrapper, Text, Title } from '../App'
import coin from '../coin.png'
import ActionButton from '../../components/Button/ActionButton'

const Coin = styled('img')`
  width: 21px;
  height: 21px;
`
const CenterFixedRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export default function Document() {
  const { t } = useI18n()

  return (
    <PageWrapper>
      <Stack
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 500,
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '0 30px 0',
          border: '1px dotted',
          borderColor: '#555',
          padding: '0 40px 80px'
        }}
      >
        <Divider />
        <Title mt={20}>{t('text121')}</Title>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text ml={8}>{t('text122')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>877878</span>
          </Text>
        </ContentView>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text ml={8}>{t('text123')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>877878</span>
          </Text>
        </ContentView>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Text ml={8}>{t('text124')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>877878</span>
          </Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton pendingText={'pae'} onAction={() => {}} actionText={'领取'} />
        </Box>
      </Stack>
      <Stack
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 500,
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '35px 30px',
          border: '1px dotted',
          borderColor: '#555',
          padding: '0 40px 80px'
        }}
      >
        <Divider />
        <Title mt={20}>{t('text125')}</Title>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text ml={8}>{t('text123')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>877878</span>
          </Text>
        </ContentView>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text ml={8}>{t('text124')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>877878</span>
          </Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton pendingText={'pae'} onAction={() => {}} actionText={'领取'} />
        </Box>
      </Stack>
      <Stack
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 500,
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '0 30px 0',
          border: '1px dotted',
          borderColor: '#555',
          padding: '0 40px 80px'
        }}
      >
        <Divider />
        <Title mt={20}>{t('text124')}</Title>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text ml={8}>{t('text123')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>877878</span>
          </Text>
        </ContentView>
        <ContentView alignItems={'center'}>
          <CenterFixedRow>
            <Coin src={coin} />
            <Text ml={8}>{t('text124')}</Text>
          </CenterFixedRow>
          <Text
            sx={{
              '& span:first-of-type': {
                color: '#7742FF'
              }
            }}
          >
            <span>877878</span>
          </Text>
        </ContentView>
        <Box mt={20}>
          <ActionButton pendingText={'pae'} onAction={() => {}} actionText={'领取'} />
        </Box>
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
