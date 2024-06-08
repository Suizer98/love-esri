import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { useEffect, useRef, useState } from 'react'

import { useMapStore } from '../../../store/useMapStore'
import MapComboBox from './MapComboBox'
import MapDirections from './MapDirections'
import { createRecenterButton } from './MapRecenterButton'
import { createSearchWidget } from './MapSearchWidget'
import useRouting from './useRouting'

const MapPort: React.FC = () => {
  const viewType = useMapStore((state) => state.mapType)
  const { setIsMapAvailable } = useMapStore()

  const viewRef = useRef<MapView | SceneView | null>(null)
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
        center: [103, 1.5],
        ui: {
          components: []
        }
      })
    } else {
      view = new MapView({
        container: viewDiv,
        map: map,
        zoom: 6,
        center: [103.5, 1.5],
        ui: {
          components: []
        }
      })
    }

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
      }
    }
  }, [viewType, setIsMapAvailable])

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
