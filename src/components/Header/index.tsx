import { useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AppBar, Box, IconButton, MenuItem, Stack, styled as muiStyled, styled } from '@mui/material'
import { ExternalLink } from 'theme/components'
import Web3Status from './Web3Status'
import { HideOnMobile, ShowOnMobile } from 'theme/index'
import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import logo from '../../assets/svg/logo.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
import { ArrowBackIos } from '@mui/icons-material'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  { title: 'Home', route: routes.home },
  { title: 'CPS NFT', route: routes.nftmining },
  { title: 'CPS 质押', route: routes.staking },
  { title: 'CPS SWAP', route: routes.swap },
  { title: 'cps 邀约', route: routes.inviter },
  { title: 'CPS 协议', route: routes.nftmining }
]

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 14,
  color: theme.palette.text.primary,
  opacity: 0.5,
  '&:hover': {
    opacity: 1
  }
})

const StyledNavLink = styled(Link)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  height: theme.height.header,
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 40px 0 25px!important',
  zIndex: theme.zIndex.drawer,
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  '& .link': {
    textDecoration: 'none',
    fontSize: 14,
    color: theme.palette.text.primary,
    opacity: 0.5,
    marginRight: 48,
    paddingBottom: '30px',
    borderBottom: '2px solid transparent',
    '&.active': {
      opacity: 1,
      borderColor: theme.palette.text.primary
    },
    '&:hover': {
      opacity: 1
    }
  },
  [theme.breakpoints.down('lg')]: {
    '& .link': { marginRight: 15 },
    padding: '0 24px 0 0!important'
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

const MainLogo = styled(Link)(({ theme }) => ({
  '& img': {
    width: 180.8,
    height: 34.7
  },
  '&:hover': {
    cursor: 'pointer'
  },
  [theme.breakpoints.down('sm')]: {
    '& img': { width: 32, height: 'auto' },
    marginBottom: -10
  }
}))

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  marginLeft: 60,
  [theme.breakpoints.down('lg')]: {
    marginLeft: 0
  }
}))

const WebLink = styled(Link)(({}) => ({
  color: '#363636',
  fontSize: 13
}))

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const handleMobileMenueDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenueDismiss} />
      <Filler />
      <StyledAppBar>
        <Stack direction={'row'} alignItems={'center'} height={54}>
          <ArrowBackIos fontSize={'small'} sx={{ color: 'black' }} />
          <WebLink to={''}>http://www.cps.io</WebLink>
        </Stack>
        <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} height={54}>
          <Box display="flex" alignItems="center">
            <MainLogo id={'logo'} to={'/'}>
              <Image src={logo} alt={'logo'} />
            </MainLogo>
            <HideOnMobile breakpoint="md">
              <LinksWrapper>
                {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
                  subTab ? (
                    <Box
                      sx={{
                        marginRight: {
                          xs: 15,
                          lg: 48
                        },
                        height: 'auto',
                        paddingBottom: '30px',
                        borderBottom: '2px solid transparent',
                        borderColor: theme =>
                          subTab.some(tab => tab.route && pathname.includes(tab.route))
                            ? theme.palette.text.primary
                            : 'transparnet',
                        display: 'inline'
                      }}
                      key={title + idx}
                    >
                      <PlainSelect
                        key={title + idx}
                        placeholder={title}
                        autoFocus={false}
                        width={title === 'Test' ? '70px' : undefined}
                        style={{
                          height: '16px'
                        }}
                      >
                        {subTab.map((sub, idx) =>
                          sub.link ? (
                            <MenuItem
                              key={sub.link + idx}
                              sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                              selected={false}
                            >
                              <ExternalLink
                                href={sub.link}
                                className={'link'}
                                color="#00000050"
                                sx={{
                                  '&:hover': {
                                    color: '#232323!important'
                                  }
                                }}
                              >
                                {sub.titleContent ?? sub.title}
                              </ExternalLink>
                            </MenuItem>
                          ) : (
                            <MenuItem key={sub.title + idx}>
                              <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                            </MenuItem>
                          )
                        )}
                      </PlainSelect>
                    </Box>
                  ) : link ? (
                    <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 14 }}>
                      {titleContent ?? title}
                    </ExternalLink>
                  ) : (
                    <Link
                      key={title + idx}
                      id={`${route}-nav-link`}
                      to={route ?? ''}
                      className={
                        (route
                          ? pathname.includes(route)
                            ? 'active'
                            : pathname.includes('account')
                            ? route.includes('account')
                              ? 'active'
                              : ''
                            : ''
                          : '') + ' link'
                      }
                    >
                      {titleContent ?? title}
                    </Link>
                  )
                )}
              </LinksWrapper>
            </HideOnMobile>
          </Box>

          <Box display="flex" alignItems="center" gap={{ xs: '6px', sm: '20px' }}>
            <Web3Status />
            <ShowOnMobile breakpoint="md">
              <IconButton
                sx={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  height: { xs: 24, sm: 32 },
                  width: { xs: 24, sm: 32 },
                  mb: { xs: 0, sm: 15 },
                  mt: { xs: 0, sm: 8 },
                  padding: '4px',
                  borderRadius: '8px'
                }}
                onClick={() => {
                  setMobileMenuOpen(open => !open)
                }}
              >
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="#252525">
                  <path d="M1 1H13" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M1 7H13" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </IconButton>
            </ShowOnMobile>
          </Box>
        </Stack>
      </StyledAppBar>
    </>
  )
}
