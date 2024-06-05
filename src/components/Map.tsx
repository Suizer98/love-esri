import Basemap from '@arcgis/core/Basemap'
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
      map: map,
      zoom: 5,
      center: [103, 1.5]
    })

    return () => {
      if (view) {
        ;(view.container as unknown) = null
      }
    }
  }, [])

  return <div id="viewDiv" style={{ height: '100%', width: '100%' }}></div>
}

export default MapPort
