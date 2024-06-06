import Basemap from '@arcgis/core/Basemap'
// Import necessary modules for routing
import Graphic from '@arcgis/core/Graphic'
import Map from '@arcgis/core/Map'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import * as route from '@arcgis/core/rest/route'
import FeatureSet from '@arcgis/core/rest/support/FeatureSet'
import RouteParameters from '@arcgis/core/rest/support/RouteParameters'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Search from '@arcgis/core/widgets/Search'
import { useEffect } from 'react'

import { useMapStore } from '../../../store/useMapStore'
import { basemapItems } from './constants'

const MapPort = () => {
  const viewType = useMapStore((state) => state.viewType)
  const routingMode = useMapStore((state) => state.routingMode)

  useEffect(() => {
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
        zoom: 5,
        center: [103, 1.5],
        ui: {
          components: []
        }
      })
    }

    const searchWidgetDiv = document.createElement('div')
    searchWidgetDiv.id = 'searchWidgetDiv'
    searchWidgetDiv.className = 'absolute top-2 left-2 p-2 z-10'
    view.ui.add(searchWidgetDiv)

    new Search({
      container: searchWidgetDiv,
      view: view
    })

    const updateBasemapStyle = (basemapId: string) => {
      view.map.basemap = new Basemap({
        style: {
          id: basemapId
        }
      })
    }

    const basemapStylesDiv = document.getElementById('basemapStyles')
    if (basemapStylesDiv) {
      const styleCombobox = basemapStylesDiv.querySelector('#styleCombobox') as HTMLDivElement
      if (styleCombobox) {
        styleCombobox.addEventListener('calciteComboboxChange', (event: any) => {
          const selectedItem = event.target.selectedItems[0]
          if (selectedItem) {
            updateBasemapStyle(selectedItem.value)
          }
        })
      }
    }

    if (routingMode) {
      // Setup for routing
      const routeUrl =
        'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World'
      const routeLayer = new GraphicsLayer()
      map.add(routeLayer)

      const routeParams = new RouteParameters({
        apiKey: import.meta.env.VITE_ESRI_API,
        stops: new FeatureSet({
          features: []
        }),
        outSpatialReference: { wkid: 3857 }
      })

      const stopSymbol = new SimpleMarkerSymbol({
        style: 'cross',
        size: 15,
        outline: { width: 4 }
      })

      const routeSymbol = new SimpleLineSymbol({
        color: [0, 0, 255, 0.5],
        width: 5
      })

      view.on('click', addStop)

      function addStop(event: any) {
        const stop = new Graphic({
          geometry: event.mapPoint,
          symbol: stopSymbol
        })
        routeLayer.add(stop)

        ;(routeParams.stops as FeatureSet).features.push(stop)
        if ((routeParams.stops as FeatureSet).features.length >= 2) {
          route.solve(routeUrl, routeParams).then(showRoute)
        }
      }

      function showRoute(data: any) {
        const routeResult = data.routeResults[0].route
        routeResult.symbol = routeSymbol
        routeLayer.add(routeResult)
      }
    }

    return () => {
      if (view) {
        view.destroy()
      }
    }
  }, [viewType, routingMode])

  return (
    <div id="viewDiv" style={{ height: '100%', width: '100%', padding: 0, margin: 0 }}>
      <div
        id="basemapStyles"
        className="esri-widget"
        style={{
          position: 'absolute',
          top: '70px',
          right: '10px',
          width: '250px',
          padding: '10px',
          zIndex: 5
        }}
      >
        <calcite-combobox id="styleCombobox" selection-mode="single" clear-disabled>
          {basemapItems.map((item) => (
            <calcite-combobox-item
              key={item.value}
              value={item.value}
              text-label={item.text}
              selected={item.selected || false}
            ></calcite-combobox-item>
          ))}
        </calcite-combobox>
      </div>
    </div>
  )
}

export default MapPort
