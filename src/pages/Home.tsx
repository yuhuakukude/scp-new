import { ContentView, Divider, Frame, PageWrapper, Text, Title } from './App'
import { useI18n } from 'react-simple-i18n'
import { useNFTContract } from '../hooks/useContract'

export default function Home() {
  const { t } = useI18n()
  const nftContract = useNFTContract()
  console.log(nftContract)
  return (
    <PageWrapper>
      <Frame>
        <Title>{t('text1')}</Title>
        <Divider />
        <ContentView>
          <Text>{t('text2')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('test3')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text4')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text5')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text6')}</Text>
          <Text>0</Text>
        </ContentView>
      </Frame>
      <Frame>
        <Title>{t('text7')}</Title>
        <Divider />
        <ContentView>
          <Text>{t('text8')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text9')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text10')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text11')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text12')}</Text>
          <Text>0</Text>
        </ContentView>
      </Frame>
      <Frame>
        <Title>{t('text13')}</Title>
        <Divider />
        <ContentView>
          <Text>{t('text14')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text15')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text16')}</Text>
          <Text>0</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text17')}</Text>
          <Text>0</Text>
        </ContentView>
      </Frame>
    </PageWrapper>
  )
}
