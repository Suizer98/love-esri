import { Box, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAuthStore } from '../../store/useAuthStore'
import About from '../About'
import MapPort from '../Map'
import Warning from '../Warning'

interface LoveEsriViewSideBarProps {
  isVisible: boolean
}

export function LoveEsriViewSideBar({ isVisible }: LoveEsriViewSideBarProps) {
  const { user, checkExistingSession } = useAuthStore(
    (state) => ({
      user: state.user,
      signIn: state.signIn,
      signOut: state.signOut,
      checkExistingSession: state.checkExistingSession
    }),
    shallow
  )

  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

  return (
    <Box display="flex" width="100%" height="100%">
      <Box
        width={isVisible ? '20%' : '0'}
        bg="gray.50"
        p={isVisible ? 4 : 0}
        transition="width 0.3s ease, padding 0.3s ease"
        overflow="hidden"
      >
        <VStack align="start" spacing={4}>
          {isVisible && (
            <>
              <Text fontWeight="bold" color="blue.800">
                station 1
              </Text>
              <Text fontWeight="bold" color="blue.800">
                station 2
              </Text>
            </>
          )}
        </VStack>
      </Box>
      <Box flex="1" transition="width 0.3s ease" width={isVisible ? '80%' : '100%'}>
        <Routes>
          {user ? (
            <Route path="/" element={<MapPort />} />
          ) : (
            <Route path="/" element={<Warning />} />
          )}
          <Route path="/about" element={<About />} />
        </Routes>
      </Box>
    </Box>
  )
}
