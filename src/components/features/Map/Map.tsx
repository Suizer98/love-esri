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
  const { isMapAvailable, setIsMapAvailable, setViewRef, cachedViews, setCachedView } =
    useMapStore()
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

    let view: MapView | SceneView | null | any = cachedViews[viewType]

    if (!view) {
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
      }

      // Cache the view for future reuse
      setCachedView(viewType, view)

      // Initialize layers and widgets
      addLayerRecursively()
      createSearchWidget(view)
      createRecenterButton(view)
    } else {
      // Reuse the cached view
      view.container = viewDiv
      view.center = [-96.0005, 39.0005]
      view.zoom = 3
    }

    setViewRef(view)
    viewRef.current = view

    view
      .when(() => {
        setIsMapAvailable(true)
        if (!legendRef.current) {
          const legendExpand = new Expand({
            view: view,
            content: new Legend({ view: view }),
            expanded: false,
            mode: 'floating'
          })
          view.ui.add(legendExpand, 'bottom-left')
          legendRef.current = legendExpand
        }
      })
      .catch((error: Error) => {
        console.error('Error loading view:', error)
      })

    return () => {
      if (viewRef.current && viewType !== view.viewingMode) {
        // Detach the container but do not destroy the view
        const dummyDiv = document.createElement('div')
        viewRef.current.container = dummyDiv
        setViewRef(null)
      }
    }
  }, [viewType])

  useEffect(() => {
    const view = useMapStore.getState().viewRef
    if (view) {
      useMapStore.getState().setIsLayersLoading(true)
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
