import { Box } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'

import { useAuthStore } from '../../store/useAuthStore'
import About from '../features/About'
import MapPort from '../features/Map/Map'
import Playground from '../features/Playground/Playground'
import Warning from '../features/Warning'

interface LoveEsriMainPortProps {
  isVisible: boolean
  isDesktopMode: boolean
}

export function LoveEsriMainPort(props: LoveEsriMainPortProps) {
  const { user } = useAuthStore((state) => state)

  return (
    <Box
      flex="1"
      transition="width 0.3s ease"
      width={props.isVisible ? { base: '0%', md: '80%' } : '100%'}
    >
      <Routes>
        {user ? (
          <Route path="/" element={<MapPort />} />
        ) : (
          (!props.isVisible || props.isDesktopMode) && <Route path="/" element={<Warning />} />
        )}
        {user ? (
          <Route path="/playground" element={<Playground />} />
        ) : (
          (!props.isVisible || props.isDesktopMode) && (
            <Route path="/playground" element={<Warning />} />
          )
        )}
        {(!props.isVisible || props.isDesktopMode) && <Route path="/about" element={<About />} />}
      </Routes>
    </Box>
  )
}
