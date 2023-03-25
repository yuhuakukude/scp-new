import { ContentView, Frame, LineDivider, PageWrapper, Tab, TabFrame, Text, Title } from './App'
import img2 from './img2.png'
import { useI18n } from 'react-simple-i18n'
import ActionButton from '../components/Button/ActionButton'
import { Box, Stack, styled } from '@mui/material'
import coin from './coin.png'

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
    </PageWrapper>
  )
}
