import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Box, Stack, styled, Typography } from '@mui/material'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
// import WarningModal from '../components/Modal/WarningModal'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
import { langData } from '../langs/lang'
import { createI18n, I18nProvider } from 'react-simple-i18n'
import bg from './bg.png'
import cardBG from './card_bg.png'
import Home from './Home'
import NFTMining from './NFTMining'
import CPS from './CPS'
import Liquidity from './swap/Liquidity'
import Inviter from './inviter'
import Swap from './swap/Swap'
import Pledge from './pledge/Index'

// import Footer from 'components/Footer'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%'
  // maxHeight: '100vh',
  // overflow: 'auto',
  // alignItems: 'center'
})

const BodyWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  paddingTop: 80,
  minHeight: `calc(100vh - ${theme.height.header})`,
  marginTop: 60,
  flex: 1,
  // overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`
  }
}))

export const PageWrapper = styled(Box)`
  width: 100%;
  background-image: url(${bg});
  background-size: 100%;
`

export const Frame = styled('div')(({ bg }: { bg?: string }) => ({
  backgroundImage: `url(${bg ?? cardBG})`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  width: 'calc(100% - 60px)',
  maxWidth: 500,
  margin: 30,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  padding: '60px 60px 80px'
}))

export const TabFrame = styled(Stack)`
  width: calc(100% - 60px);
  max-width: 500px;
  margin: 38px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 0 30px;
  flex-direction: row;
`

export const Tab = styled(Box)`
  height: 44px;
  flex: 1;
  text-align: center;
  border: 1px solid #7742ff;
  border-radius: 50px;
  line-height: 44px;
  font-size: 14px;
  color: #7742ff;
  font-weight: bold;
`

export const Divider = styled(Box)`
  border-bottom: 2px dashed #8d8d8d;
  margin-top: 17px;
`

export const LineDivider = styled(Box)`
  border-bottom: 1px solid #f5f6fb;
  margin-top: 22px;
`

export const ContentView = styled(Stack)`
  margin-top: 15px;
  flex-direction: row;
  justify-content: space-between;
`

export const Text = styled(Typography)`
  font-size: 12px;
`

export const Title = styled(Typography)`
  text-align: center;
  font-size: 20px;
  color: #000000;
`

export default function App() {
  return (
    <Suspense fallback={null}>
      <I18nProvider i18n={createI18n(langData, { lang: 'en' })}>
        <ModalProvider>
          <AppWrapper id="app">
            <ContentWrapper>
              <Header />
              <BodyWrapper id="body">
                <Popups />
                <Polling />
                {/* <WarningModal /> */}
                <Web3ReactManager>
                  <Routes>
                    <Route path={routes.home} element={<Home />} />
                    <Route path={routes.nftmining} element={<NFTMining />} />
                    <Route path={routes.cps} element={<CPS />} />
                    <Route path={routes.inviter} element={<Inviter />} />
                    <Route path={routes.liquidity} element={<Liquidity />} />
                    <Route path={routes.swap} element={<Swap />} />
                    <Route path={routes.pledge} element={<Pledge />} />

                    <Route path="*" element={<Navigate to={routes.home} replace />} />
                  </Routes>
                </Web3ReactManager>
              </BodyWrapper>
              {/* <Footer /> */}
            </ContentWrapper>
          </AppWrapper>
        </ModalProvider>
      </I18nProvider>
    </Suspense>
  )
}
