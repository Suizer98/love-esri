import Graphic from '@arcgis/core/Graphic'
import Map from '@arcgis/core/Map'
import Point from '@arcgis/core/geometry/Point'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Search from '@arcgis/core/widgets/Search'
import { useCallback, useEffect, useRef } from 'react'

import { usePlaygroundStore } from '../../../store/usePlaygroundStore'

const Playground = () => {
  const { setViewRef, mapType, setIsPMapAvailable, pointMode, addedPoints, setAddedPoints } =
    usePlaygroundStore()
  const viewRef = useRef<MapView | SceneView | null>(null)

  useEffect(() => {
    setIsPMapAvailable(false)

    const map = new Map({
      basemap: 'arcgis/navigation',
      ground: 'world-elevation'
    })

    const viewDiv = document.getElementById('viewDiv') as HTMLDivElement

    let view: MapView | SceneView

    if (mapType === '3D') {
      view = new SceneView({
        container: viewDiv,
        map: map,
        zoom: 3,
        center: [-100.39899666, 37.77940678],
        ui: {
          components: []
        }
      })
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
    }

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

  const handleClick = useCallback(
    (event: any) => {
      if (viewRef.current) {
        const point = new Point({
          longitude: event.mapPoint.longitude,
          latitude: event.mapPoint.latitude
        })
        setAddedPoints((prevPoints) => [...prevPoints, point])
      }
    },
    [setAddedPoints]
  )

  useEffect(() => {
    let handle: __esri.Handle | undefined

    if (pointMode && viewRef.current) {
      handle = viewRef.current.on('click', handleClick)
    } else if (viewRef.current) {
      // viewRef.current.graphics.removeAll()
      // setAddedPoints([])
    }

    return () => {
      if (handle) {
        handle.remove()
      }
    }
  }, [pointMode, handleClick, setAddedPoints])

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.graphics.removeAll()
      addedPoints.forEach((point) => {
        const symbol = new SimpleMarkerSymbol({
          color: 'blue',
          size: '8px'
        })
        const graphic = new Graphic({
          geometry: point,
          symbol: symbol
        })
        viewRef.current!.graphics.add(graphic)
      })
    }
  }, [addedPoints])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div id="viewDiv" style={{ height: '100%', width: '100%' }}></div>
    </div>
  )
}

export default Playground
