import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer'
import SceneLayer from '@arcgis/core/layers/SceneLayer'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { useEffect, useRef, useState } from 'react'

import { useLayersStore } from '../../../store/useLayersStore'
import { useMapStore } from '../../../store/useMapStore'
import MapComboBox from './MapComboBox'
import MapDirections from './MapDirections'
import { createRecenterButton } from './MapRecenterButton'
import { createSearchWidget } from './MapSearchWidget'
import { useRouting } from './useRouting'

const MapPort: React.FC = () => {
  const viewType = useMapStore((state) => state.mapType)
  const { setIsMapAvailable, setViewRef } = useMapStore()
  const { layers, addLayer } = useLayersStore()

  const viewRef = useRef<MapView | SceneView | null>(null)
  const { routeSteps, loading } = useRouting(viewRef)

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const layerAddedRef = useRef<boolean>(false)

  function addLayerRecursively() {
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

  useEffect(() => {
    setIsMapAvailable(false)

    const map = new Map({
      basemap: 'satellite',
      ground: 'world-elevation'
    })

    const viewDiv = document.getElementById('viewDiv') as HTMLDivElement

    let view: MapView | SceneView

    if (viewType === '3D') {
      view = new SceneView({
        container: viewDiv,
        scale: 123456789,
        map: map,
        zoom: 3,
        center: [-100.39899666, 37.77940678],
        ui: {
          components: []
        }
      })

      // Add Layer
      addLayerRecursively()
    } else {
      view = new MapView({
        container: viewDiv,
        map: map,
        zoom: 3,
        center: [-100.39899666, 37.77940678],
        ui: {
          components: []
        }
      })

      // Add Layer
      addLayerRecursively()
    }

    setViewRef(view)
    viewRef.current = view

    createSearchWidget(view)
    createRecenterButton(view)

    view
      .when(() => {
        setIsMapAvailable(true)
      })
      .catch((error) => {
        console.error('Error loading view:', error)
      })

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
        setViewRef(null)
      }
    }
  }, [viewType])

  useEffect(() => {
    const view = useMapStore.getState().viewRef
    if (view) {
      layers.forEach((layer) => {
        let layerInstance
        if (viewType === '3D' && layer.name === '3D Buildings') {
          layerInstance = view.map.findLayerById(layer.name) as SceneLayer
          if (!layerInstance) {
            layerInstance = new SceneLayer({
              id: layer.name,
              url: layer.url
            })
            view.map.add(layerInstance)
          }
        } else if (viewType === '2D' && layer.name === '2D Flow') {
          layerInstance = view.map.findLayerById(layer.name) as ImageryTileLayer
          if (!layerInstance) {
            layerInstance = new ImageryTileLayer({
              id: layer.name,
              url: layer.url,
              renderer: layer.renderer,
              effect: layer.effect
            })
            view.map.add(layerInstance)
          }
        }

        if (layerInstance) {
          layerInstance.visible = layer.visible
        }
      })
    }
  }, [layers, viewType])

  const updateBasemapStyle = (basemapId: string) => {
    if (viewRef.current) {
      const newBasemap = new Basemap({
        style: {
          id: basemapId
        }
      })

      newBasemap
        .load()
        .then(() => {
          viewRef.current!.map.basemap = newBasemap
        })
        .catch((error) => {
          console.error('Error loading basemap:', error)
        })
    }
  }

  return (
    <>
      <div id="viewDiv" style={{ height: '100%', width: '100%', padding: 0, margin: 0 }}>
        <MapDirections
          loading={loading}
          routeSteps={routeSteps}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
      <MapComboBox updateBasemapStyle={updateBasemapStyle} />
    </>
  )
}

export default MapPort
