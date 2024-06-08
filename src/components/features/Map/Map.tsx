import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
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
  const layerAddedRef = useRef<boolean>(false) // Ref to track if the layer has been added
  const { routeSteps, loading } = useRouting(viewRef)

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

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
        zoom: 6,
        center: [-100.39899666, 37.77940678],
        ui: {
          components: []
        }
      })

      // Check if the layer has already been added
      if (!layerAddedRef.current) {
        // Add the 3D buildings layer
        addLayer({
          name: '3D Buildings',
          url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/SF_BLDG_WSL1/SceneServer',
          visible: true
        })
        layerAddedRef.current = true // Set the ref to true to indicate the layer has been added
      }
    } else {
      view = new MapView({
        container: viewDiv,
        map: map,
        zoom: 6,
        center: [-121.85784391531126, 36.58649531264832],
        ui: {
          components: []
        }
      })
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
        let layerInstance = view.map.findLayerById(layer.name) as SceneLayer
        if (!layerInstance) {
          layerInstance = new SceneLayer({
            id: layer.name,
            url: layer.url
          })
          view.map.add(layerInstance)
        }
        layerInstance.visible = layer.visible
      })
    }
  }, [layers])

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
