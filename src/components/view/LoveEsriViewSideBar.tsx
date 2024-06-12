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

interface LoveEsriViewSideBarProps {
  isVisible: boolean
}

export function LoveEsriViewSideBar({ isVisible }: LoveEsriViewSideBarProps) {
  const { checkExistingSession } = useAuthStore(
    (state) => ({
      user: state.user,
      signIn: state.signIn,
      signOut: state.signOut,
      checkExistingSession: state.checkExistingSession
    }),
    shallow
  )

  const { routingMode, toggleRoutingMode, isMapAvailable, mapType, switchMapType } = useMapStore(
    (state) => ({
      routingMode: state.routingMode,
      toggleRoutingMode: state.toggleRoutingMode,
      isMapAvailable: state.isMapAvailable,
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

  const { isDesktopMode } = useViewStore((state) => ({
    isDesktopMode: state.isDesktopMode
  }))

  const location = useLocation()
  const isMapRoute = location.pathname === '/'
  const isPlayGroundRoute = location.pathname === '/playground'

  useEffect(() => {
    checkExistingSession()
  }, [checkExistingSession])

  useEffect(() => {
    if (routingMode == true) {
      toggleRoutingMode()
    }
  }, [mapType])

  useEffect(() => {
    if (!isPlayGroundRoute && pointMode) {
      togglePointMode()
    }
  }, [isMapRoute, isPlayGroundRoute])

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
              {isMapRoute && (
                <>
                  <Text className="esri-widget" bg="gray.200" fontWeight="bold" color="blue.800">
                    Switch View Type
                  </Text>
                  <Tooltip label="Switch between 2D or 3D Map" bg="black" placement="top">
                    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                      <RadioGroup
                        onChange={(value) => switchMapType(value as '2D' | '3D')}
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
                        onChange={toggleRoutingMode}
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
                  <Text className="esri-widget" bg="gray.200" fontWeight="bold" color="blue.800">
                    Add points
                  </Text>
                  <Tooltip label="Create points" bg="black" placement="top">
                    <Box bg="white" p={4} borderRadius="md" boxShadow="md">
                      <Checkbox
                        isChecked={pointMode}
                        disabled={!isPMapAvailable}
                        onChange={togglePointMode}
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
      <LoveEsriMainPort isVisible={isVisible} isDesktopMode={isDesktopMode} />
    </Box>
  )
}
