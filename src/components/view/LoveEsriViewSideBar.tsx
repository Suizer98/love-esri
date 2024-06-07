import { Box, Checkbox, Radio, RadioGroup, Stack, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAuthStore } from '../../store/useAuthStore'
import { useMapStore } from '../../store/useMapStore'
import About from '../features/About'
import MapPort from '../features/Map/Map'
import Warning from '../features/Warning'
import { LoveEsriSideBarRoute } from './LoveEsriRoute'

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

  const { viewType, switchMapType } = useMapStore((state) => ({
    viewType: state.mapType,
    switchMapType: state.switchMapType
  }))

  const { routingMode, toggleRoutingMode, isMapAvailable } = useMapStore(
    (state) => ({
      routingMode: state.routingMode,
      toggleRoutingMode: state.toggleRoutingMode,
      isMapAvailable: state.isMapAvailable
    }),
    shallow
  )

  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

  return (
    <Box display="flex" width="100%" height="100%">
      <Box
        width={isVisible ? { base: '100%', md: '20%' } : '0'}
        bg="gray.200"
        p={isVisible ? 4 : 0}
        transition="width 0.3s ease, padding 0.3s ease"
        overflow="hidden"
      >
        <VStack align="start" spacing={4}>
          {isVisible && (
            <>
              <LoveEsriSideBarRoute />
              <Text fontWeight="bold" color="blue.800">
                Switch View Type
              </Text>
              <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                <RadioGroup
                  onChange={(value) => switchMapType(value as '2D' | '3D')}
                  value={viewType}
                  isDisabled={!isMapAvailable}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="2D" disabled={!isMapAvailable}>
                      2D View
                    </Radio>
                    <Radio value="3D" disabled={!isMapAvailable}>
                      3D View
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Text fontWeight="bold" color="blue.800">
                Toggle route mode
              </Text>
              <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                <Checkbox
                  isChecked={routingMode}
                  disabled={!isMapAvailable}
                  onChange={toggleRoutingMode}
                >
                  Enable Routing
                </Checkbox>
              </Box>
            </>
          )}
        </VStack>
      </Box>
      <Box
        flex="1"
        transition="width 0.3s ease"
        width={isVisible ? { base: '0%', md: '80%' } : '100%'}
      >
        <Routes>
          {user ? (
            <Route path="/" element={<MapPort />} />
          ) : (
            !isVisible && <Route path="/" element={<Warning />} />
          )}
          {!isVisible && <Route path="/about" element={<About />} />}
        </Routes>
      </Box>
    </Box>
  )
}
