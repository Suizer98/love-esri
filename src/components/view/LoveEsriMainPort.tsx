import { Box } from '@chakra-ui/react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { useAuthStore } from '../../store/useAuthStore'
import { useMapStore } from '../../store/useMapStore'
import { usePlaygroundStore } from '../../store/usePlaygroundStore'
import { useViewStore } from '../../store/useViewStore'
import About from '../features/About'
import LoadingOverlay from '../features/Loading'
import MapPort from '../features/Map/Map'
import Playground from '../features/Playground/Playground'
import Warning from '../features/Warning'

interface LoveEsriMainPortProps {
  isVisible: boolean
  isDesktopMode: boolean
}

export function LoveEsriMainPort(props: LoveEsriMainPortProps) {
  const { user } = useAuthStore((state) => state)
  const { isMapAvailable } = useMapStore()
  const { isPMapAvailable } = usePlaygroundStore()
  const { isDesktopMode, isSidebarVisible } = useViewStore()
  const location = useLocation()

  const renderLoadingOverlay = () => {
    if (!isDesktopMode && isSidebarVisible) return null

    // Only show loading overlay if there's a user (either authenticated or with API key)
    if (!user) return null

    if (location.pathname === '/' && !isMapAvailable) {
      return <LoadingOverlay />
    } else if (location.pathname === '/playground' && !isPMapAvailable) {
      return <LoadingOverlay />
    }
    return null
  }

  return (
    <Box
      flex="1"
      transition="width 0.3s ease"
      width={props.isVisible ? { base: '0%', md: '80%' } : '100%'}
      position="relative"
    >
      {renderLoadingOverlay()}
      <Routes>
        {user ? (
          <Route path="/" element={<MapPort />} />
        ) : (
          (!props.isVisible || isDesktopMode) && <Route path="/" element={<Warning />} />
        )}
        {user ? (
          <Route path="/playground" element={<Playground />} />
        ) : (
          (!props.isVisible || isDesktopMode) && <Route path="/playground" element={<Warning />} />
        )}
        {(!props.isVisible || isDesktopMode) && <Route path="/about" element={<About />} />}
      </Routes>
    </Box>
  )
}
