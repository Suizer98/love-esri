import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Expand from '@arcgis/core/widgets/Expand'
import Legend from '@arcgis/core/widgets/Legend'
import { useEffect, useRef, useState } from 'react'

import { useLayersStore } from '../../../store/useLayersStore'
import { useMapStore } from '../../../store/useMapStore'
import MapComboBox from './MapComboBox'
import MapDirections from './MapDirections'
import { createRecenterButton } from './MapRecenterButton'
import { createSearchWidget } from './MapSearchWidget'
import { addLayerRecursively, addLayersToMap } from './layerUtils'
import { useRouting } from './useRouting'

const MapPort: React.FC = () => {
  const viewType = useMapStore((state) => state.mapType)
  const { isMapAvailable, setIsMapAvailable, setViewRef } = useMapStore()
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
        center: [-96.0005, 39.0005],
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
        center: [-96.0005, 39.0005],
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
        const legendExpand = new Expand({
          view: view,
          content: new Legend({ view: view }),
          expanded: false,
          mode: 'floating'
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
      addLayersToMap(view, viewType, layers)
    }
  }, [layers, viewType])

  return (
    <>
      <div id="viewDiv" style={{ height: '100%', width: '100%', padding: 0, margin: 0 }}>
        {isMapAvailable && (
          <MapDirections
            loading={loading}
            routeSteps={routeSteps}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        )}
      </div>
      <MapComboBox />
    </>
  )
}

export default MapPort
