import { useMediaQuery } from '@chakra-ui/react'
import { useEffect } from 'react'

import { useViewStore } from '../store/useViewStore'
import { LoveEsriViewBar } from './view/LoveEsriViewBar'
import { LoveEsriViewSideBar } from './view/LoveEsriViewSideBar'

const LoveEsriApp = () => {
  const [isLargerThanWidth] = useMediaQuery('(min-width: 768px)')
  const { setIsDesktopMode, toggleSidebar } = useViewStore()

  useEffect(() => {
    setIsDesktopMode(isLargerThanWidth)
    if (isLargerThanWidth) {
      toggleSidebar()
    }
  }, [isLargerThanWidth, setIsDesktopMode, toggleSidebar])

  return (
    <>
      <LoveEsriViewBar />
      <LoveEsriViewSideBar />
    </>
  )
}

export default LoveEsriApp
