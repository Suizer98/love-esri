import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer'
import SceneLayer from '@arcgis/core/layers/SceneLayer'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Expand from '@arcgis/core/widgets/Expand'
import Legend from '@arcgis/core/widgets/Legend'
import { useEffect, useRef, useState } from 'react'

import styles from '../../../MapPort.module.css'
import { useLayersStore } from '../../../store/useLayersStore'
import { useMapStore } from '../../../store/useMapStore'
import MapComboBox from './MapComboBox'
import MapDirections from './MapDirections'
import { createRecenterButton } from './MapRecenterButton'
import { createSearchWidget } from './MapSearchWidget'
import { addLayerRecursively } from './layerUtils'
import { useRouting } from './useRouting'

const MapPort: React.FC = () => {
  const viewType = useMapStore((state) => state.mapType)
  const { setIsMapAvailable, setViewRef } = useMapStore()
  const { layers } = useLayersStore()

  const viewRef = useRef<MapView | SceneView | null>(null)
  const legendRef = useRef<__esri.Expand | null>(null)
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
        const legendDiv = document.createElement('div')
        legendDiv.className = styles.legendContent

        const legendExpand = new Expand({
          view: view,
          content: new Legend({ view: view }),
          expanded: false
        })
        view.ui.add(legendExpand, 'bottom-left')
        legendRef.current = legendExpand
      })
      .catch((error) => {
        console.error('Error loading view:', error)
      })

    return () => {
      if (viewRef.current) {
        if (legendRef.current) {
          viewRef.current.ui.remove(legendRef.current)
          legendRef.current.destroy()
          legendRef.current = null
        }
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
