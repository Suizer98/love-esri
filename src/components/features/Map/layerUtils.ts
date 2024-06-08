// src/utils/layerUtils.ts
import { useLayersStore } from '../../../store/useLayersStore'

export const addLayerRecursively = () => {
  const { layers, addLayer } = useLayersStore.getState()
  const layerAddedRef = { current: false }

  if (!layerAddedRef.current) {
    if (!layers.some((layer) => layer.name === '3D Buildings')) {
      const layer = {
        name: '3D Buildings',
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/SF_BLDG_WSL1/SceneServer',
        visible: true,
        type: '3D'
      }
      addLayer(layer)
    }
    // Check if the 2D Flow layer has already been added
    if (!layers.some((layer) => layer.name === '2D Flow')) {
      const layer = {
        name: '2D Flow',
        url: 'https://tiledimageservices.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/NLDAS_Hourly_8_30_2021/ImageServer',
        visible: true,
        type: '2D',
        renderer: {
          type: 'flow',
          trailWidth: '2px',
          density: 1,
          visualVariables: [
            {
              type: 'color',
              field: 'Magnitude',
              stops: [
                { color: [40, 146, 199, 1], value: 0 },
                { color: [160, 194, 155, 1], value: 5 },
                { color: [218, 230, 119, 1], value: 10 }
              ]
            }
          ]
        },
        effect: 'bloom(1.5, 0.5px, 0)'
      }
      addLayer(layer)
    }
    layerAddedRef.current = true
  }
}
