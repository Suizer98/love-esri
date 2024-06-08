import SceneView from '@arcgis/core/views/SceneView'
import { Box, Checkbox, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'

import { useLayersStore } from '../../store/useLayersStore'
import { useMapStore } from '../../store/useMapStore'

const LayerVisibilityControl: React.FC = () => {
  const { layers, toggleLayerVisibility } = useLayersStore()
  const { viewRef, mapType } = useMapStore()

  const updateCameraPosition = () => {
    if (viewRef && mapType === '3D') {
      const view = viewRef as SceneView
      view.goTo({
        position: {
          longitude: -122.39899666,
          latitude: 37.77940678,
          z: 314.88439
        },
        heading: 356.82,
        tilt: 78.61
      })
    }
  }

  const handleLayerToggle = (layerName: string) => {
    const layer = layers.find((l) => l.name === layerName)
    if (layer) {
      toggleLayerVisibility(layerName)
      if (layerName === '3D Buildings' && viewRef && !layer.visible) {
        updateCameraPosition()
      }
    }
  }

  // Ensure 3D Buildings layer is unchecked and disabled in 2D mode
  useEffect(() => {
    const layer = layers.find((l) => l.name === '3D Buildings')
    if (mapType === '2D' && layer && layer.visible) {
      toggleLayerVisibility(layer.name)
    }
  }, [mapType])

  return (
    <Box bg="white" p={4} borderRadius="md" boxShadow="md" width="100%">
      <VStack align="start">
        {layers.map((layer) => (
          <Checkbox
            key={layer.name}
            isChecked={layer.name === '3D Buildings' && mapType === '2D' ? false : layer.visible}
            isDisabled={layer.name === '3D Buildings' && mapType === '2D'}
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
