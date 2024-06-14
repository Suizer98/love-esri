import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { Box, Checkbox, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'

import { useLayersStore } from '../../store/useLayersStore'
import { useMapStore } from '../../store/useMapStore'
import { useViewStore } from '../../store/useViewStore'

const LayerVisibilityControl: React.FC = () => {
  const { layers, toggleLayerVisibility } = useLayersStore()
  const { viewRef, mapType, isMapAvailable } = useMapStore()
  const { isDesktopMode, toggleSidebar } = useViewStore()

  const updateCameraPosition = async (layerName: string, position3D: boolean) => {
    if (viewRef) {
      const view = viewRef as SceneView | MapView
      const layer = view.map.findLayerById(layerName) as ImageryTileLayer
      if (layer) {
        await layer.when()
        const extent = layer.fullExtent
        if (extent) {
          const options = position3D
            ? {
                target: extent,
                position: {
                  longitude: extent.center.x,
                  latitude: extent.center.y,
                  z: 314.88439
                },
                heading: 356.82,
                tilt: 78.61
              }
            : extent

          view.goTo(options)
          if (!position3D && (view as MapView).zoom < 3) (view as MapView).zoom = 3
        }
      }
    }
  }

  const handleLayerToggle = (layerName: string) => {
    const layer = layers.find((l) => l.name === layerName)
    if (layer) {
      toggleLayerVisibility(layerName)
      if (!layer.visible) {
        if (layerName === '3D Buildings' && mapType === '3D') updateCameraPosition(layerName, true)
        else if (layerName === '2D Flow' && mapType === '2D') updateCameraPosition(layerName, false)
        else if (layerName === 'Satellites') {
          const recenterButton = document.querySelector(
            '.recenter-button.esri-widget--button.esri-widget'
          )
          recenterButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        }
      }
      if (!isDesktopMode) toggleSidebar()
    }
  }

  useEffect(() => {
    ;['3D Buildings', '2D Flow'].forEach((layerName) => {
      const layer = layers.find((l) => l.name === layerName)
      if (
        layer &&
        layer.visible &&
        ((mapType === '2D' && layerName === '3D Buildings') ||
          (mapType === '3D' && layerName === '2D Flow'))
      ) {
        toggleLayerVisibility(layer.name)
      }
    })
  }, [mapType])

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="md" width="100%">
      <VStack align="start">
        {layers.map((layer) => (
          <Checkbox
            key={layer.name}
            isChecked={
              layer.type === mapType || layer.name === 'Satellites' ? layer.visible : false
            }
            isDisabled={(layer.type !== mapType && layer.name !== 'Satellites') || !isMapAvailable}
            onChange={() => handleLayerToggle(layer.name)}
          >
            {layer.name}
          </Checkbox>
        ))}
      </VStack>
    </Box>
  )
}

export default LayerVisibilityControl
