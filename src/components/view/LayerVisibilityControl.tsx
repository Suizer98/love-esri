import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { Box, Checkbox, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'

import { useLayersStore } from '../../store/useLayersStore'
import { useMapStore } from '../../store/useMapStore'

const LayerVisibilityControl: React.FC = () => {
  const { layers, toggleLayerVisibility } = useLayersStore()
  const { viewRef, mapType, isMapAvailable } = useMapStore()

  const updateCameraPosition3D = async (layerName: string) => {
    if (viewRef && mapType === '3D') {
      const view = viewRef as SceneView
      const layer = view.map.findLayerById(layerName)
      if (layer) {
        await layer.when()
        const extent = layer.fullExtent
        if (extent) {
          view.goTo({
            target: extent,
            position: {
              longitude: extent.center.x,
              latitude: extent.center.y,
              z: extent.center.z
            },
            heading: 356.82,
            tilt: 78.61
          })
        }
      }
    }
  }

  const updateCameraPosition2D = async (layerName: string) => {
    if (viewRef && mapType === '2D') {
      const view = viewRef as MapView
      const layer = view.map.findLayerById(layerName) as ImageryTileLayer
      if (layer) {
        await layer.when()
        const extent = layer.fullExtent
        if (extent) {
          view.goTo(extent)
        }
      }
    }
  }

  const handleLayerToggle = (layerName: string) => {
    const layer = layers.find((l) => l.name === layerName)
    if (layer) {
      toggleLayerVisibility(layerName)
      if (layerName === '3D Buildings' && viewRef && !layer.visible) {
        updateCameraPosition3D(layerName)
      } else if (layerName === '2D Flow' && viewRef && !layer.visible) {
        updateCameraPosition2D(layerName)
      }
    }
  }

  // Ensure 3D Buildings and 2D Flow layers are unchecked and disabled in 2D and 3D modes respectively
  useEffect(() => {
    const layersToToggle = ['3D Buildings', '2D Flow']
    layersToToggle.forEach((layerName) => {
      const layer = layers.find((l) => l.name === layerName)
      if (
        (mapType === '2D' && layerName === '3D Buildings' && layer && layer.visible) ||
        (mapType === '3D' && layerName === '2D Flow' && layer && layer.visible)
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
              (layer.type === '3D' && mapType === '2D') || (layer.type === '2D' && mapType === '3D')
                ? false
                : layer.visible
            }
            isDisabled={
              (layer.type === '3D' && mapType === '2D') ||
              (layer.type === '2D' && mapType === '3D') ||
              !isMapAvailable
            }
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
