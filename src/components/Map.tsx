import Basemap from '@arcgis/core/Basemap.js'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import { useEffect } from 'react'

const MapPort = () => {
  useEffect(() => {
    const basemap = new Basemap({
      style: {
        id: 'arcgis/outdoor'
      }
    })

    const map = new Map({
      basemap: basemap
    })

    const viewDiv = document.getElementById('viewDiv') as HTMLDivElement

    const view = new MapView({
      container: viewDiv,
      map: map
    })

    return () => {
      if (view) {
        view.container = null
      }
    }
  }, [])

  return <div id="viewDiv" style={{ height: '100vh', width: '100vw' }}></div>
}

export default MapPort
