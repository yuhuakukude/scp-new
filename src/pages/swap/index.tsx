import { PageWrapper, Tab, TabFrame } from '../App'
import { useI18n } from 'react-simple-i18n'
import { useState } from 'react'
import Swap from './Swap'
import Liquidity from './Liquidity'

export default function SwapPage() {
  const { t } = useI18n()
  const [isSwap, setIsSwap] = useState(true)
  return (
    <PageWrapper>
      <TabFrame gap={10}>
        <Tab active={isSwap} onClick={() => setIsSwap(true)}>
          {t('text65')}
        </Tab>
        <Tab active={!isSwap} onClick={() => setIsSwap(false)}>
          {t('text66')}
        </Tab>
      </TabFrame>
      {isSwap ? <Swap /> : <Liquidity />}
    </PageWrapper>
  )
}
