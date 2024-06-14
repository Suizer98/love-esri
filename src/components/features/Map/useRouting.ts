import Graphic from '@arcgis/core/Graphic'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import * as route from '@arcgis/core/rest/route'
import FeatureSet from '@arcgis/core/rest/support/FeatureSet'
import RouteParameters from '@arcgis/core/rest/support/RouteParameters'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import { useToast } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

import { useMapStore } from '../../../store/useMapStore'

export const useRouting = (
  viewRef: React.MutableRefObject<__esri.MapView | __esri.SceneView | null>
) => {
  const { routingMode } = useMapStore()
  const routeLayerRef = useRef<GraphicsLayer | null>(null)
  const routeParamsRef = useRef<RouteParameters | null>(null)
  const stopSymbolRef = useRef<SimpleMarkerSymbol | null>(null)
  const routeSymbolRef = useRef<SimpleLineSymbol | null>(null)
  const clickHandlerRef = useRef<__esri.WatchHandle | null>(null)
  const clearClickHandlerRef = useRef<__esri.WatchHandle | null>(null)

  const [routeSteps, setRouteSteps] = useState<[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const toast = useToast()

  useEffect(() => {
    if (routingMode) {
      const routeLayer = new GraphicsLayer()
      routeLayerRef.current = routeLayer
      viewRef.current?.map.add(routeLayer)

      let token

      const credential = IdentityManager.findCredential('https://www.arcgis.com/sharing')

      if (credential && credential.token) {
        token = credential.token
      } else {
        token = import.meta.env.VITE_ESRI_API
      }

      const routeParams = new RouteParameters({
        apiKey: token,
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

  return { routeSteps, loading }
}

export default useRouting
