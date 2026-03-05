import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Expand from '@arcgis/core/widgets/Expand'
import Legend from '@arcgis/core/widgets/Legend'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useLayersStore } from '../../../store/useLayersStore'
import { useMapStore } from '../../../store/useMapStore'
import MapComboBox from './MapComboBox'
import MapDirections from './MapDirections'
import { createRecenterButton } from './MapRecenterButton'
import { createSearchWidget } from './MapSearchWidget'
import { addLayerRecursively, addLayersToMap } from './layerUtils'
import { useRouting } from './useRouting'

const MapPort: React.FC = () => {
  const viewType = useMapStore((state) => state.mapType)
  const {
    isMapAvailable,
    setIsMapAvailable,
    setViewRef,
    setCachedView,
    setMapRoot,
    setPositionObserver
  } = useMapStore()
  const { layers } = useLayersStore()

  const viewRef = useRef<MapView | SceneView | null>(null)
  const legendRef = useRef<Expand | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)
  const mapRootRef = useRef<HTMLDivElement | null>(null)
  const { routeSteps, loading } = useRouting(viewRef)

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [slotRect, setSlotRect] = useState<DOMRect | null>(null)

  const updateSlotRect = useCallback(() => {
    if (slotRef.current?.isConnected) {
      setSlotRect(slotRef.current.getBoundingClientRect())
    }
  }, [])

  useEffect(() => {
    const el = slotRef.current
    if (!el) return
    updateSlotRect()
    const ro = new ResizeObserver(updateSlotRect)
    ro.observe(el)
    const onScroll = () => updateSlotRect()
    window.addEventListener('scroll', onScroll, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [updateSlotRect])

  useEffect(() => {
    const slotEl = slotRef.current
    if (!slotEl) return

    const { cachedViews, mapRoots } = useMapStore.getState()
    const cachedView = cachedViews[viewType]
    const existingRoot = mapRoots[viewType]

    if (cachedView && existingRoot) {
      // Reuse cached view from store: show its map root and position it (no container reassignment)
      existingRoot.style.visibility = ''
      existingRoot.style.pointerEvents = ''
      const updatePosition = () => {
        if (!slotEl.isConnected) return
        const rect = slotEl.getBoundingClientRect()
        existingRoot.style.position = 'fixed'
        existingRoot.style.left = `${rect.left}px`
        existingRoot.style.top = `${rect.top}px`
        existingRoot.style.width = `${rect.width}px`
        existingRoot.style.height = `${rect.height}px`
      }
      updatePosition()
      const resizeObserver = new ResizeObserver(updatePosition)
      const onScroll = () => updatePosition()
      window.addEventListener('scroll', onScroll, true)
      resizeObserver.observe(slotEl)
      setPositionObserver(viewType, { resizeObserver, onScroll })

      setViewRef(cachedView)
      viewRef.current = cachedView
      mapRootRef.current = existingRoot
      setIsMapAvailable(true)

      return () => {
        setViewRef(null)
        viewRef.current = null
        mapRootRef.current = null
        existingRoot.style.visibility = 'hidden'
        existingRoot.style.pointerEvents = 'none'
        const obs = useMapStore.getState().positionObservers[viewType]
        if (obs) {
          window.removeEventListener('scroll', obs.onScroll, true)
          obs.resizeObserver.disconnect()
          setPositionObserver(viewType, null)
        }
      }
    }

    // Create new view and cache it in the store
    setIsMapAvailable(false)
    const map = new Map({
      basemap: 'satellite',
      ground: 'world-elevation'
    })

    const mapRoot = document.createElement('div')
    mapRoot.style.position = 'absolute'
    mapRoot.style.inset = '0'
    mapRoot.style.pointerEvents = 'none'
    mapRoot.style.zIndex = '0'
    mapRootRef.current = mapRoot

    const viewDiv = document.createElement('div')
    viewDiv.id = 'viewDiv'
    viewDiv.style.position = 'absolute'
    viewDiv.style.inset = '0'
    viewDiv.style.pointerEvents = 'auto'
    mapRoot.appendChild(viewDiv)

    const updatePosition = () => {
      if (!slotEl.isConnected) return
      const rect = slotEl.getBoundingClientRect()
      mapRoot.style.position = 'fixed'
      mapRoot.style.left = `${rect.left}px`
      mapRoot.style.top = `${rect.top}px`
      mapRoot.style.width = `${rect.width}px`
      mapRoot.style.height = `${rect.height}px`
    }

    updatePosition()
    document.body.appendChild(mapRoot)
    setMapRoot(viewType, mapRoot)

    const resizeObserver = new ResizeObserver(updatePosition)
    const onScroll = () => updatePosition()
    window.addEventListener('scroll', onScroll, true)
    resizeObserver.observe(slotEl)
    setPositionObserver(viewType, { resizeObserver, onScroll })

    const view: MapView | SceneView =
      viewType === '3D'
        ? new SceneView({
            container: viewDiv,
            scale: 123456789,
            map: map,
            zoom: 3,
            center: [-96.0005, 39.0005],
            ui: { components: [] }
          })
        : new MapView({
            container: viewDiv,
            map: map,
            zoom: 3,
            center: [-96.0005, 39.0005],
            ui: { components: [] }
          })

    setCachedView(viewType, view)
    setViewRef(view)
    viewRef.current = view

    addLayerRecursively()
    createSearchWidget(view)
    createRecenterButton(view)

    view
      .when(() => {
        setIsMapAvailable(true)
        setTimeout(() => {
          if (!legendRef.current && viewRef.current) {
            const legendExpand = new Expand({
              view: viewRef.current,
              content: new Legend({ view: viewRef.current }),
              expanded: false,
              mode: 'floating'
            })
            viewRef.current.ui.add(legendExpand, 'bottom-left')
            legendRef.current = legendExpand
          }
        }, 0)
      })
      .catch((error: Error) => {
        console.error('Error loading view:', error)
      })

    return () => {
      mapRootRef.current = null
      mapRoot.style.visibility = 'hidden'
      mapRoot.style.pointerEvents = 'none'
      const obs = useMapStore.getState().positionObservers[viewType]
      if (obs) {
        window.removeEventListener('scroll', obs.onScroll, true)
        obs.resizeObserver.disconnect()
        setPositionObserver(viewType, null)
      }
      setViewRef(null)
      viewRef.current = null
      legendRef.current = null
      // Keep view and mapRoot in store for next mount (no destroy)
    }
  }, [viewType, setCachedView, setMapRoot, setPositionObserver, setViewRef, setIsMapAvailable])

  useEffect(() => {
    const view = viewRef.current
    if (view) {
      useMapStore.getState().setIsLayersLoading(true)
      addLayersToMap(view, viewType, layers)
    }
  }, [layers, viewType])

  return (
    <>
      <div style={{ position: 'relative', height: '100%', width: '100%', padding: 0, margin: 0 }}>
        <div ref={slotRef} style={{ position: 'absolute', inset: 0 }} />
        {slotRect && isMapAvailable && (
          <div
            style={{
              position: 'fixed',
              left: slotRect.left,
              top: slotRect.top,
              width: slotRect.width,
              height: slotRect.height,
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>
              <MapDirections
                loading={loading}
                routeSteps={routeSteps}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
              />
            </div>
          </div>
        )}
      </div>
      <MapComboBox />
    </>
  )
}

export default MapPort
