import Basemap from '@arcgis/core/Basemap'
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
import { Button, Heading } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

import { useMapStore } from '../../../store/useMapStore'
import useViewStore from '../../../store/useViewStore'
import { basemapItems } from './constants'

const MapPort = () => {
  const viewType = useMapStore((state) => state.viewType)
  const routingMode = useMapStore((state) => state.routingMode)

  const viewRef = useRef<MapView | SceneView | null>(null)
  const routeLayerRef = useRef<GraphicsLayer | null>(null)
  const routeParamsRef = useRef<RouteParameters | null>(null)
  const stopSymbolRef = useRef<SimpleMarkerSymbol | null>(null)
  const routeSymbolRef = useRef<SimpleLineSymbol | null>(null)
  const clickHandlerRef = useRef<__esri.WatchHandle | null>(null)

  const [routeSteps, setRouteSteps] = useState<[]>([])
  const { isSidebarVisible, toggleSidebar } = useViewStore()

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

    viewRef.current = view

    const searchWidgetDiv = document.createElement('div')
    searchWidgetDiv.id = 'searchWidgetDiv'
    searchWidgetDiv.className = 'absolute top-4 left-2 p-2 z-10'
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

    return () => {
      if (clickHandlerRef.current) {
        clickHandlerRef.current.remove()
      }
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [viewType])

  useEffect(() => {
    if (routingMode) {
      const routeLayer = new GraphicsLayer()
      routeLayerRef.current = routeLayer
      viewRef.current?.map.add(routeLayer)

      const routeParams = new RouteParameters({
        apiKey: import.meta.env.VITE_ESRI_API,
        stops: new FeatureSet({
          features: []
        }),
        outSpatialReference: { wkid: 3857 },
        returnDirections: true
      })
      routeParamsRef.current = routeParams

      const stopSymbol = new SimpleMarkerSymbol({
        style: 'cross',
        size: 15,
        outline: { width: 4 }
      })
      stopSymbolRef.current = stopSymbol

      const routeSymbol = new SimpleLineSymbol({
        color: [0, 0, 255, 0.5],
        width: 5
      })
      routeSymbolRef.current = routeSymbol

      const addStop = (event: any) => {
        const stop = new Graphic({
          geometry: event.mapPoint,
          symbol: stopSymbol
        })
        routeLayer.add(stop)
        ;(routeParams.stops as FeatureSet).features.push(stop)
        if ((routeParams.stops as FeatureSet).features.length >= 2) {
          route
            .solve(
              'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World',
              routeParams
            )
            .then(showRoute)
            .catch((error) => {
              console.error('Error solving route:', error)
            })
        }
      }

      const showRoute = (data: any) => {
        if (data.routeResults && data.routeResults.length > 0 && data.routeResults[0].route) {
          const routeResult = data.routeResults[0].route
          routeResult.symbol = routeSymbol
          routeLayer.add(routeResult)

          const extent = data.routeResults[0].directions.extent
          zoomToExtent(extent)

          setRouteSteps(data.routeResults[0].directions.features)
        } else {
          console.error('No valid route result found:', data)
        }
      }

      const zoomToExtent = (extent: any) => {
        if (viewRef.current) {
          viewRef.current.goTo(extent).catch((error: any) => {
            console.error('Error zooming to extent:', error)
          })
        }
      }

      clickHandlerRef.current = viewRef.current?.on('click', addStop) || null

      return () => {
        if (clickHandlerRef.current) {
          clickHandlerRef.current.remove()
        }
        if (viewRef.current?.map && routeLayerRef.current) {
          viewRef.current.map.remove(routeLayerRef.current)
        }
      }
    } else {
      setRouteSteps([])
    }
  }, [routingMode])

  return (
    <div id="viewDiv" style={{ height: '100%', width: '100%', padding: 0, margin: 0 }}>
      {isSidebarVisible && (
        <div
          id="basemapStyles"
          className="esri-widget"
          style={{
            position: 'absolute',
            top: '72px',
            right: '10px',
            width: '250px',
            height: '48px',
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
      )}
      {routeSteps.length > 0 ? (
        <div
          title="Route Directions"
          className="esri-widget"
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            width: '250px',
            maxHeight: isSidebarVisible ? '50%' : '50px',
            overflowY: isSidebarVisible ? 'auto' : 'hidden',
            zIndex: 10,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            transition: 'max-height 0.3s ease-in-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Heading as="h4" size="md" mb={0}>
              Directions
            </Heading>
            <Button size="sm" onClick={() => toggleSidebar()}>
              {isSidebarVisible ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          {isSidebarVisible && (
            <div style={{ listStyleType: 'none', padding: '10px 0 0 0' }}>
              {routeSteps.map((step: any, index: any) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  {`${index + 1}. ${step.attributes.text}`}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default MapPort
