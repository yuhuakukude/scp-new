import { ContentView, Divider, Frame, PageWrapper, Text, Title } from './App'
import { useI18n } from 'react-simple-i18n'
import { useNFT } from 'hooks/useNft'
import { useNftMine } from 'hooks/useNftMine'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { USDT, CPS } from '../constants'
import useCopyClipboard from 'hooks/useCopyClipboard'
import { Box, Button, Link, Stack } from '@mui/material'
import icon0 from '../../src/assets/images/18916.png'
import icon1 from '../../src/assets/images/9003.png'
import icon2 from '../../src/assets/images/9000.png'
import icon3 from '../../src/assets/images/9007.png'
import icon4 from '../../src/assets/images/9004.png'
import icon5 from '../../src/assets/images/9001.png'
import icon6 from '../../src/assets/images/9111.png'
import icon7 from '../../src/assets/images/9112.png'
import icon8 from '../../src/assets/images/8987.png'
import icon9 from '../../src/assets/images/9116.png'
import icon10 from '../../src/assets/images/8988.png'
import icon11 from '../../src/assets/images/9125.png'
import icon12 from '../../src/assets/images/8984.png'
import icon13 from '../../src/assets/images/17008.png'
import icon14 from '../../src/assets/images/9120.png'
import iconCertik from '../../src/assets/images/8138.png'
import iconMetaMask from '../../src/assets/images/8139.png'
import iconBiance from '../../src/assets/images/8140.png'
import iconPancake from '../../src/assets/images/8144.png'
import footerIcon from '../../src/assets/images/footerIcon.png'

const iconList = [
  icon0,
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  icon6,
  icon7,
  icon8,
  icon9,
  icon10,
  icon11,
  icon12,
  icon13,
  icon14
]

export default function Home() {
  const { t } = useI18n()
  const { chainId, account } = useActiveWeb3React()
  const [isCopied, setCopied] = useCopyClipboard()

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
      <Stack
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 500,
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '0 30px 0',
          padding: '0 40px 80px'
        }}
      >
        <Title>{t('text118')}</Title>
        <Box
          sx={{
            marginTop: 30,
            '& img': {
              padding: 20
            }
          }}
        >
          {iconList.map(item => {
            return <img width={'30%'} key={item} src={item} />
          })}
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
          padding: '0 60px 80px'
        }}
      >
        <Title>{t('text119')}</Title>
        <Box display={'flex'} flexDirection="row" justifyContent={'space-between'} mt={35}>
          <img width={'10%'} src={iconCertik} alt="" />
          <img width={'10%'} src={iconMetaMask} alt="" />
          <img width={'10%'} src={iconBiance} alt="" />
          <img width={'10%'} src={iconPancake} alt="" />
        </Box>
      </Stack>
      <Text
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 281,
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '0 auto 0',
          lineHeight: 1.5,
          padding: '0 60px 80px'
        }}
      >
        {t('text120')}
      </Text>
      <Stack
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 500,
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '0 auto 0',
          alignItems: 'center',
          lineHeight: 1.5,
          padding: '0 30px 80px',
          '& button': {
            maxWidth: 120,
            height: 35,
            lineHeight: '35px',
            backgroundColor: '#8691a8'
          }
        }}
      >
        <Link href="office@CPS.com">office@CPS.com</Link>
        <Button onClick={() => setCopied('office@CPS.com')}>{isCopied ? 'Copied' : 'Copy'}</Button>
      </Stack>
      <Text
        sx={{
          width: 'calc(100% - 60px)',
          maxWidth: 281,
          fontWeight: 400,
          fontFamily: 'PingFang SC-Regular, PingFang SC',
          textAlign: 'center',
          margin: '0 auto 0',
          lineHeight: 1.5,
          padding: '0 60px 80px'
        }}
      >
        {t('text121')}
      </Text>
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
          }
        }}
      >
        <img width={64} src={footerIcon} alt="" />
        <Text mt={10}>Copyright © 2023CPS</Text>
      </Stack>
    </PageWrapper>
  )
}
