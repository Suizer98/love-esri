import { useMediaQuery } from '@chakra-ui/react'
import { useEffect } from 'react'

import useViewStore from '../store/useViewStore'
import { LoveEsriViewBar } from './view/LoveEsriViewBar'
import { LoveEsriViewSideBar } from './view/LoveEsriViewSideBar'

const LoveEsriApp = () => {
  const { isSidebarVisible, toggleSidebar, setIsDesktopMode, isDesktopMode } = useViewStore()
  const [isLargerThanWidth] = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (isLargerThanWidth) {
      setIsDesktopMode(true)
    } else {
      setIsDesktopMode(false)
    }
  }, [isLargerThanWidth])

  return (
    <>
      <LoveEsriViewBar onToggleSidebar={toggleSidebar} />
      <LoveEsriViewSideBar isVisible={isSidebarVisible} />
    </>
  )
}

export default LoveEsriApp
