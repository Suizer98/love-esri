import { useMediaQuery } from '@chakra-ui/react'
import { useEffect } from 'react'

import { useViewStore } from '../store/useViewStore'
import { LoveEsriViewBar } from './view/LoveEsriViewBar'
import { LoveEsriViewSideBar } from './view/LoveEsriViewSideBar'

const LoveEsriApp = () => {
  const { isSidebarVisible, toggleSidebar, setIsDesktopMode } = useViewStore()
  const [isLargerThanWidth] = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (isLargerThanWidth) {
      setIsDesktopMode(true)
      toggleSidebar()
    } else {
      setIsDesktopMode(false)
    }
  }, [isLargerThanWidth])

  return (
    <>
      <LoveEsriViewBar onToggleSidebar={toggleSidebar} />
      <LoveEsriViewSideBar isVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />
    </>
  )
}

export default LoveEsriApp
