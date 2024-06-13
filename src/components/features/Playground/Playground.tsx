import Graphic from '@arcgis/core/Graphic'
import Map from '@arcgis/core/Map'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { SimpleMarkerSymbol } from '@arcgis/core/symbols'
import SceneView from '@arcgis/core/views/SceneView'
import { useEffect, useRef } from 'react'

import { usePlaygroundStore } from '../../../store/usePlaygroundStore'
import { createRecenterButton } from './MapRecenterButton'
import PlaygroundPoint from './PlaygroundPoint'
import { initializeTimeSlider, loadSatelliteData } from './PlaygroundSatellites'

const Playground: React.FC = () => {
  const { setViewRef, mapType, setIsPMapAvailable, addedPoints } = usePlaygroundStore()
  const viewRef = useRef<SceneView | null>(null)

  const initialCamera = {
    position: {
      x: -100.39899666,
      y: 37.77940678,
      z: 100000000, // Ensure the camera is high enough to see the points
      head: 0,
      tilt: 0,
      spatialReference: {
        wkid: 4326
      }
    }
  }

  useEffect(() => {
    setIsPMapAvailable(false)

    const map = new Map({
      basemap: 'arcgis/navigation',
      ground: 'world-elevation'
    })

    const viewDiv = document.getElementById('viewDiv') as HTMLDivElement

    let view: SceneView

    view = new SceneView({
      container: viewDiv,
      map: map,
      zoom: 1,
      camera: initialCamera,
      ui: {
        components: []
      }
    })

    setViewRef(view)
    viewRef.current = view

    const satellitesLayer = new GraphicsLayer({ id: 'Satellites' })
    map.add(satellitesLayer)

    const pointsLayer = new GraphicsLayer({ id: 'Points' })
    map.add(pointsLayer)

    view
      .when(() => {
        setIsPMapAvailable(true)
        // createRecenterButton(view, initialCamera)
        createRecenterButton(view, initialCamera, satellitesLayer, pointsLayer)
        updatePointsLayer(pointsLayer)

        // Load satellite data and initialize the time slider
        loadSatelliteData()
          .then((data) => {
            initializeTimeSlider(view, satellitesLayer, data)
          })
          .catch((error) => {
            console.error('Error loading satellite data:', error)
          })
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
  }, [mapType, setViewRef])

  useEffect(() => {
    if (viewRef.current) {
      const pointsLayer = viewRef.current.map.findLayerById('Points') as GraphicsLayer
      if (pointsLayer) {
        updatePointsLayer(pointsLayer)
      }
    }
  }, [addedPoints])

  const updatePointsLayer = (pointsLayer: GraphicsLayer) => {
    pointsLayer.removeAll()
    addedPoints.forEach((point) => {
      const symbol = new SimpleMarkerSymbol({
        color: 'blue',
        size: '8px'
      })
      const graphic = new Graphic({
        geometry: point,
        symbol: symbol
      })
      pointsLayer.add(graphic)
    })
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div id="viewDiv" style={{ height: '100%', width: '100%' }}></div>
      <div
        id="timeSliderDiv"
        style={{ position: 'absolute', bottom: '10px', left: '10px', width: '50%' }}
      ></div>
      <PlaygroundPoint viewRef={viewRef} />
    </div>
  )
}

export default Playground
