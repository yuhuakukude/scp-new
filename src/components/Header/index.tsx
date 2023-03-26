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
import Select from '../Select/Select'
import { useI18n } from 'react-simple-i18n'

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
  { title: 'CPS 质押', route: routes.pledge },
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
  fontSize: 13,
  textDecoration: 'none'
}))

export default function Header() {
  const { i18n } = useI18n()
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
        <Stack direction={'row'} alignItems={'center'} height={49}>
          <ArrowBackIos fontSize={'small'} sx={{ color: 'black' }} />
          <WebLink to={''}>http://www.cps.io</WebLink>
          <Box sx={{ marginLeft: 'auto' }}>
            <Web3Status />
          </Box>
        </Stack>
        <Stack direction={'row'} width={'100%'} justifyContent={'space-between'} height={49}>
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
            <Web3Status showAddress />
            <Select
              height={'20px'}
              style={{
                background: 'transparent',
                '& .Mui-disabled.MuiSelect-select.MuiInputBase-input': {
                  color: theme => theme.palette.text.primary,
                  WebkitTextFillColor: theme => theme.palette.text.primary
                }
              }}
              defaultValue={'en'}
              value={i18n.getLang()}
            >
              <MenuItem onClick={() => i18n.setLang('en')} selected={i18n.getLang() === 'en'} value={'en'}>
                EN
              </MenuItem>
              <MenuItem onClick={() => i18n.setLang('cn')} selected={i18n.getLang() === 'cn'} value={'cn'}>
                中文
              </MenuItem>
            </Select>
            <ShowOnMobile breakpoint="md">
              <IconButton
                sx={{
                  height: { xs: 27, sm: 32 },
                  width: { xs: 27, sm: 32 },
                  mb: { xs: 0, sm: 15 },
                  mt: { xs: 0, sm: 8 },
                  padding: '4px',
                  borderRadius: '8px'
                }}
                onClick={() => {
                  setMobileMenuOpen(open => !open)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27.108"
                  height="21.478"
                  viewBox="0 0 27.108 21.478"
                  fill="#7742FF"
                >
                  <path
                    className="a"
                    d="M259.689,296.437H236.752a2.085,2.085,0,1,1,0-4.17h22.938a2.085,2.085,0,0,1,0,4.17Zm0,8.654H236.752a2.085,2.085,0,1,1,0-4.17h22.938a2.085,2.085,0,0,1,0,4.17Zm0,8.654H236.752a2.085,2.085,0,0,1,0-4.17h22.938a2.085,2.085,0,0,1,0,4.17Z"
                    transform="translate(-234.666 -292.267)"
                  />
                </svg>
              </IconButton>
            </ShowOnMobile>
          </Box>
        </Stack>
      </StyledAppBar>
    </>
  )
}
