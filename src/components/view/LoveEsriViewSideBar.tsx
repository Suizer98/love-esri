import { Box, Checkbox, Radio, RadioGroup, Stack, Text, Tooltip, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAuthStore } from '../../store/useAuthStore'
import { useMapStore } from '../../store/useMapStore'
import { usePlaygroundStore } from '../../store/usePlaygroundStore'
import { useViewStore } from '../../store/useViewStore'
import LayerVisibilityControl from './LayerVisibilityControl'
import { LoveEsriMainPort } from './LoveEsriMainPort'
import LoveEsriPlaygroundPoints from './LoveEsriPlaygroundPoints'
import { LoveEsriPopover } from './LoveEsriPopover'
import { LoveEsriSideBarRoute } from './LoveEsriRoute'

export function LoveEsriViewSideBar() {
  const { checkExistingSession } = useAuthStore(
    (state) => ({
      user: state.user,
      signIn: state.signIn,
      signOut: state.signOut,
      checkExistingSession: state.checkExistingSession
    }),
    shallow
  )

  const {
    routingMode,
    toggleRoutingMode,
    isMapAvailable,
    setIsMapAvailable,
    mapType,
    switchMapType
  } = useMapStore(
    (state) => ({
      routingMode: state.routingMode,
      toggleRoutingMode: state.toggleRoutingMode,
      isMapAvailable: state.isMapAvailable,
      setIsMapAvailable: state.setIsMapAvailable,
      mapType: state.mapType,
      switchMapType: state.switchMapType
    }),
    shallow
  )

  const { isPMapAvailable, pointMode, togglePointMode } = usePlaygroundStore(
    (state) => ({
      pointMode: state.pointMode,
      isPMapAvailable: state.isPMapAvailable,
      togglePointMode: state.togglePointMode
    }),
    shallow
  )

  const { isDesktopMode, isSidebarVisible, toggleSidebar } = useViewStore()

  const location = useLocation()
  const isMapRoute = location.pathname === '/'
  const isPlayGroundRoute = location.pathname === '/playground'

  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

  useEffect(() => {
    if (!isPlayGroundRoute && pointMode) {
      togglePointMode()
    }
    if (!isPMapAvailable && pointMode) {
      togglePointMode()
    }
  }, [isMapRoute, isPlayGroundRoute, isPMapAvailable])

  const handleCheckboxChange = (toggleFunction: () => void) => {
    toggleFunction()
    if (!isDesktopMode) {
      toggleSidebar()
    }
  }

  const handleMapTypeSwitch = (value: '2D' | '3D') => {
    if (routingMode) {
      toggleRoutingMode()
    }
    setIsMapAvailable(false)
    switchMapType(value)
    if (!isDesktopMode) {
      toggleSidebar()
    }
  }

  return (
    <Box display="flex" width="100%" height="100%">
      <Box
        width={isSidebarVisible ? { base: '100%', md: '20%' } : '0'}
        bg="gray.200"
        p={isSidebarVisible ? 4 : 0}
        transition="width 0.3s ease, padding 0.3s ease"
        overflow="hidden"
      >
        <VStack align="start" spacing={4}>
          {isSidebarVisible && (
            <>
              <LoveEsriSideBarRoute />
              {isMapRoute && (
                <>
                  <Text className="esri-widget" bg="gray.200" fontWeight="bold" color="blue.800">
                    Switch View Type
                  </Text>
                  <Tooltip label="Switch between 2D or 3D Map" bg="black" placement="top">
                    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                      <RadioGroup
                        onChange={handleMapTypeSwitch}
                        value={mapType}
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
                  </Tooltip>
                  <Text className="esri-widget" bg="gray.200" fontWeight="bold" color="blue.800">
                    Toggle route mode
                  </Text>
                  <Tooltip label="Create points for routes" bg="black" placement="top">
                    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                      <Checkbox
                        isChecked={routingMode}
                        disabled={!isMapAvailable}
                        onChange={() => handleCheckboxChange(toggleRoutingMode)}
                      >
                        Enable Routing
                      </Checkbox>
                      <LoveEsriPopover />
                    </Box>
                  </Tooltip>
                  <Text className="esri-widget" bg="gray.200" fontWeight="bold" color="blue.800">
                    Layers
                  </Text>
                  <LayerVisibilityControl />
                </>
              )}
              {isPlayGroundRoute && (
                <>
                  <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                    <Text fontWeight="bold" color="blue.800">
                      Fun fact about Satellites
                    </Text>
                    <Text color="black" fontSize={12}>
                      These GPS satellites are MEO (Medium Earth Orbit) which explains the high
                      altitudes. Data are extracted from RINEX navigation files and then converted
                      from ECEF to LLH.
                    </Text>
                  </Box>
                  <Text className="esri-widget" bg="gray.200" fontWeight="bold" color="blue.800">
                    Add points
                  </Text>
                  <Tooltip label="Create points" bg="black" placement="top">
                    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                      <Checkbox
                        isChecked={pointMode}
                        disabled={!isPMapAvailable}
                        onChange={() => handleCheckboxChange(togglePointMode)}
                      >
                        Enable Point adding mode
                      </Checkbox>
                    </Box>
                  </Tooltip>
                  <Text className="esri-widget" bg="gray.200" fontWeight="bold" color="blue.800">
                    Points
                  </Text>
                  <LoveEsriPlaygroundPoints />
                </>
              )}
              {!isMapRoute && !isPlayGroundRoute && (
                <Text
                  className="esri-widget"
                  fontSize="large"
                  bg="gray.200"
                  fontWeight="bold"
                  color="blue.800"
                >
                  Nothing here...
                  <br />
                  perhaps switch to Map Tab?
                </Text>
              )}
            </>
          )}
        </VStack>
      </Box>
      <LoveEsriMainPort isVisible={isSidebarVisible} isDesktopMode={isDesktopMode} />
    </Box>
  )
}
