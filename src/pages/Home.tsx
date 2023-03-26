import { ContentView, Divider, Frame, PageWrapper, Text, Title } from './App'
import { useI18n } from 'react-simple-i18n'
import { useNFT } from 'hooks/useNft'
import { useNftMine } from 'hooks/useNftMine'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { USDT, CPS } from '../constants'
import { Stack } from '@mui/material'

export default function Home() {
  const { t } = useI18n()
  const { chainId, account } = useActiveWeb3React()
  const usdtToken = USDT[chainId ?? 56]
  const cpsToken = CPS[chainId ?? 56]
  const { totalSupply } = useNftMine()
  const { totalNFTSupply } = useNFT()

  const usdtBalance = useCurrencyBalance(account ?? undefined, usdtToken)
  const cpsBalance = useCurrencyBalance(account ?? undefined, cpsToken)
  return (
    <PageWrapper>
      <Frame>
        <Title>{t('text1')}</Title>
        <Divider />
        <ContentView>
          <Text>{t('text2')}</Text>
          <Text>{usdtBalance?.toSignificant() || '-'}</Text>
        </ContentView>
        <ContentView>
          <Text>{t('test3')}</Text>
          <Text>{cpsBalance?.toSignificant() || '-'}</Text>
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
          <Text>
            <span>$ </span>
            <span style={{ color: '#7742ff' }}>200</span>
          </Text>
        </ContentView>
        <ContentView>
          <Text>{t('text9')}</Text>
          <Text>1000</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text10')}</Text>
          <Text>{totalNFTSupply?.toString() ?? 0}</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text11')}</Text>
          <Text>{totalSupply?.toString() ?? 0}</Text>
        </ContentView>
        <ContentView>
          <Text>{t('text12')}</Text>
          <Text>{totalNFTSupply?.toString() ?? 0}</Text>
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
          <Text>1030,000</Text>
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
      <Stack>
        <Text>Partner</Text>
      </Stack>
    </PageWrapper>
  )
}
