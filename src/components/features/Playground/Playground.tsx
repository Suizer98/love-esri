import Graphic from '@arcgis/core/Graphic'
import Map from '@arcgis/core/Map'
import PopupTemplate from '@arcgis/core/PopupTemplate'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { PictureMarkerSymbol, SimpleMarkerSymbol } from '@arcgis/core/symbols'
import SceneView from '@arcgis/core/views/SceneView'
// import Search from '@arcgis/core/widgets/Search'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

import { usePlaygroundStore } from '../../../store/usePlaygroundStore'
import { createRecenterButton } from './MapRecenterButton'
import PlaygroundPoint from './PlaygroundPoint'

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

    // const search = new Search({
    //   view: view
    // })
    // view.ui.add(search, 'top-right')

    const satellitesLayer = new GraphicsLayer({ id: 'Satellites' })
    map.add(satellitesLayer)

    const pointsLayer = new GraphicsLayer({ id: 'Points' })
    map.add(pointsLayer)

    view
      .when(() => {
        setIsPMapAvailable(true)
        loadSatelliteData(satellitesLayer)
        createRecenterButton(view, initialCamera)
        updatePointsLayer(pointsLayer)
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

  const loadSatelliteData = async (satelliteLayer: GraphicsLayer) => {
    const url = '/rinex210.csv'

    try {
      const data = await d3.csv(url)

      data.forEach((d: any, i: any) => {
        const commonName = `Satellite ${d.Sat}`
        const latitude = parseScientific(d.Lat)
        const longitude = parseScientific(d.Lon)
        const altitude = parseScientific(d.Alt)

        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(altitude)) {
          const satelliteLoc = {
            type: 'point',
            x: longitude,
            y: latitude,
            z: altitude
          } as __esri.GeometryProperties

          const template = new PopupTemplate({
            title: '{name}',
            content: 'Satellite G{number} with Altitude {altitude}',
            actions: [
              {
                title: 'Show Satellite Track',
                id: 'track',
                className: 'esri-icon-globe',
                type: 'button'
              }
            ]
          })

          const graphic = new Graphic({
            geometry: satelliteLoc,
            symbol: new PictureMarkerSymbol({
              url: '/satellite.png',
              width: '48px',
              height: '48px'
            }),
            attributes: {
              name: commonName,
              number: i,
              altitude: altitude
            },
            popupTemplate: template
          })

          satelliteLayer.add(graphic)
        }
      })
    } catch (error) {
      console.error('Error loading satellite data:', error)
    }
  }

  const parseScientific = (value: string): number => {
    if (!value) return NaN
    const scientificNotationRegex = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i
    if (scientificNotationRegex.test(value)) {
      return parseFloat(value)
    }
    return NaN
  }

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
      <PlaygroundPoint viewRef={viewRef} />
    </div>
  )
}

export default Playground
