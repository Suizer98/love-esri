import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import create from 'zustand'

// Define the state interface for map settings
interface ViewTypeState {
  mapType: '2D' | '3D'
  switchMapType: (type: '2D' | '3D') => void
  routingMode: boolean
  toggleRoutingMode: () => void
  isMapAvailable: boolean
  setIsMapAvailable: (available: boolean) => void
  isMapLoading: boolean
  setIsMapLoading: (loading: boolean) => void
  viewRef: MapView | SceneView | null
  setViewRef: (view: MapView | SceneView | null) => void
  cachedViews: { '2D': MapView | null; '3D': SceneView | null }
  setCachedView: (type: '2D' | '3D', view: MapView | SceneView | null) => void
}

// Create the Zustand store for map settings
export const useMapStore = create<ViewTypeState>((set) => ({
  mapType: '3D',
  switchMapType: (type) => set({ mapType: type }),
  routingMode: false,
  toggleRoutingMode: () => set((state) => ({ routingMode: !state.routingMode })),
  isMapAvailable: false,
  setIsMapAvailable: (available) => set({ isMapAvailable: available }),
  isMapLoading: false,
  setIsMapLoading: (loading) => set({ isMapLoading: loading }),
  viewRef: null,
  setViewRef: (view) => set({ viewRef: view }),
  cachedViews: { '2D': null, '3D': null },
  setCachedView: (type, view) =>
    set((state) => ({
      cachedViews: { ...state.cachedViews, [type]: view }
    }))
}))
