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
import { Tooltip, useToast } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { useMapStore } from '../../../store/useMapStore'
import MapComboBox from './MapComboBox'
import MapDirections from './MapDirections'

const MapPort: React.FC = () => {
  const viewType = useMapStore((state) => state.mapType)
  const { setIsMapAvailable, routingMode } = useMapStore()

  const viewRef = useRef<MapView | SceneView | null>(null)
  const routeLayerRef = useRef<GraphicsLayer | null>(null)
  const routeParamsRef = useRef<RouteParameters | null>(null)
  const stopSymbolRef = useRef<SimpleMarkerSymbol | null>(null)
  const routeSymbolRef = useRef<SimpleLineSymbol | null>(null)
  const clickHandlerRef = useRef<__esri.WatchHandle | null>(null)
  const clearClickHandlerRef = useRef<__esri.WatchHandle | null>(null)

  const [routeSteps, setRouteSteps] = useState<[]>([])
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const toast = useToast()

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

    const searchWidgetDiv = document.createElement('div')
    searchWidgetDiv.id = 'searchWidgetDiv'
    searchWidgetDiv.className = 'absolute top-4 left-2 p-2 z-10'
    view.ui.add(searchWidgetDiv)

    const searchWidget = new Search({
      container: searchWidgetDiv,
      view: view
    })

    searchWidget.on('search-complete', function () {
      // Remove the docking functionality
      view.popup.dockEnabled = false
      view.popup.collapseEnabled = false
    })

    // Create and add the recenter button
    const recenterButtonDiv = document.createElement('div')
    recenterButtonDiv.className = 'recenter-button esri-widget--button esri-widget'
    const tooltipContainer = document.createElement('div')
    createRoot(tooltipContainer).render(
      <Tooltip label="Recenter" bg="black" color="white">
        <div
          className="recenter-button esri-widget--button esri-widget"
          style={{ cursor: 'pointer' }}
        >
          <span className="esri-icon esri-icon-globe"></span>
        </div>
      </Tooltip>
    )
    recenterButtonDiv.appendChild(tooltipContainer)
    view.ui.add(recenterButtonDiv, 'bottom-left')

    recenterButtonDiv.addEventListener('click', () => {
      if (viewRef.current) {
        viewRef.current.goTo({ center: [103.5, 1.5], zoom: 6, heading: 0, tilt: 0 })
      }
    })

    view
      .when(() => {
        setIsMapAvailable(true)
      })
      .catch((error) => {
        console.error('Error loading view:', error)
      })

    return () => {
      if (clickHandlerRef.current) {
        clickHandlerRef.current.remove()
      }
      if (clearClickHandlerRef.current) {
        clearClickHandlerRef.current.remove()
      }
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
      }
    }
  }, [viewType, setIsMapAvailable])

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
          setLoading(true)
          route
            .solve(
              'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World',
              routeParams
            )
            .then(showRoute)
            .catch((error) => {
              console.error('Error solving route:', error)
              toast({
                title: 'An error occurred.',
                description: 'Unable to solve route.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
              })
            })
            .finally(() => {
              setLoading(false)
            })
        }
      }

      const clearStops = () => {
        routeLayer.removeAll()
        routeParams.stops = new FeatureSet({
          features: []
        })
        setRouteSteps([])
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
          const expandedExtent = extent.clone().expand(1.2)
          viewRef.current.goTo(expandedExtent).catch((error: any) => {
            console.error('Error zooming to extent:', error)
          })
        }
      }

      clickHandlerRef.current = viewRef.current?.on('click', addStop) || null
      clearClickHandlerRef.current =
        viewRef.current?.on('double-click', (event: any) => {
          if (event.button === 2) {
            // 2 is the button number for right-click
            clearStops()
          }
        }) || null

      return () => {
        if (clickHandlerRef.current) {
          clickHandlerRef.current.remove()
        }
        if (clearClickHandlerRef.current) {
          clearClickHandlerRef.current.remove()
        }
        if (viewRef.current?.map && routeLayerRef.current) {
          viewRef.current.map.remove(routeLayerRef.current)
        }
      }
    } else {
      setRouteSteps([])
    }
  }, [routingMode])

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
