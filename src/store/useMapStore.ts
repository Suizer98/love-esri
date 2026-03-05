import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import create from 'zustand'

export type MapViewType = '2D' | '3D'

export interface PositionObserver {
  resizeObserver: ResizeObserver
  onScroll: () => void
}

interface ViewTypeState {
  mapType: MapViewType
  switchMapType: (type: MapViewType) => void
  routingMode: boolean
  toggleRoutingMode: () => void
  isMapAvailable: boolean
  setIsMapAvailable: (available: boolean) => void
  isLayersLoading: boolean
  setIsLayersLoading: (loading: boolean) => void
  viewRef: MapView | SceneView | null
  setViewRef: (view: MapView | SceneView | null) => void
  cachedViews: { '2D': MapView | null; '3D': SceneView | null }
  setCachedView: (type: MapViewType, view: MapView | SceneView | null) => void
  mapRoots: { '2D': HTMLDivElement | null; '3D': HTMLDivElement | null }
  setMapRoot: (type: MapViewType, root: HTMLDivElement | null) => void
  positionObservers: { '2D': PositionObserver | null; '3D': PositionObserver | null }
  setPositionObserver: (type: MapViewType, observer: PositionObserver | null) => void
}

export const useMapStore = create<ViewTypeState>((set) => ({
  mapType: '3D',
  switchMapType: (type) => set({ mapType: type }),
  routingMode: false,
  toggleRoutingMode: () => set((state) => ({ routingMode: !state.routingMode })),
  isMapAvailable: false,
  setIsMapAvailable: (available) => set({ isMapAvailable: available }),
  isLayersLoading: false,
  setIsLayersLoading: (loading) => set({ isLayersLoading: loading }),
  viewRef: null,
  setViewRef: (view) => set({ viewRef: view }),
  cachedViews: { '2D': null, '3D': null },
  setCachedView: (type, view) =>
    set((state) => ({
      cachedViews: { ...state.cachedViews, [type]: view }
    })),
  mapRoots: { '2D': null, '3D': null },
  setMapRoot: (type, root) =>
    set((state) => ({
      mapRoots: { ...state.mapRoots, [type]: root }
    })),
  positionObservers: { '2D': null, '3D': null },
  setPositionObserver: (type, observer) =>
    set((state) => ({
      positionObservers: { ...state.positionObservers, [type]: observer }
    }))
}))
