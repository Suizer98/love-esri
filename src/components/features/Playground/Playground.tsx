import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Search from '@arcgis/core/widgets/Search'
import { useEffect, useRef } from 'react'

import { usePlaygroundStore } from '../../../store/usePlaygroundStore'
import PlaygroundPoint from './PlaygroundPoint'

const Playground = () => {
  const { setViewRef, mapType, setIsPMapAvailable } = usePlaygroundStore()
  const viewRef = useRef<MapView | SceneView | null>(null)

  useEffect(() => {
    setIsPMapAvailable(false)

    const map = new Map({
      basemap: 'arcgis/navigation',
      ground: 'world-elevation'
    })

    const viewDiv = document.getElementById('viewDiv') as HTMLDivElement

    let view: MapView | SceneView

    view = new SceneView({
      container: viewDiv,
      map: map,
      zoom: 3,
      center: [-100.39899666, 37.77940678],
      ui: {
        components: []
      }
    })

    setViewRef(view)
    viewRef.current = view

    const search = new Search({
      view: view
    })
    view.ui.add(search, 'top-right')

    view
      .when(() => {
        setIsPMapAvailable(true)
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
  }, [mapType, setViewRef, setIsPMapAvailable])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div id="viewDiv" style={{ height: '100%', width: '100%' }}></div>
      <PlaygroundPoint viewRef={viewRef} />
    </div>
  )
}

export default Playground
