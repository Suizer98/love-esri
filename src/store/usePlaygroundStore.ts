import SceneView from '@arcgis/core/views/SceneView'
import create from 'zustand'

// Define the state interface for playground settings
interface PlaygroundState {
  mapType: '2D' | '3D'
  switchMapType: (type: '2D' | '3D') => void
  pointMode: boolean
  togglePointMode: () => void
  isPMapAvailable: boolean
  setIsPMapAvailable: (available: boolean) => void
  viewRef: SceneView | null
  setViewRef: (view: SceneView | null) => void
  addedPoints: any[]
  setAddedPoints: (points: any[] | ((prevPoints: any[]) => any[])) => void
}

// Create the Zustand store for playground settings
export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  mapType: '3D',
  switchMapType: (type) => set({ mapType: type }),
  pointMode: false,
  togglePointMode: () => set((state) => ({ pointMode: !state.pointMode })),
  isPMapAvailable: false,
  setIsPMapAvailable: (available) => set({ isPMapAvailable: available }),
  viewRef: null,
  setViewRef: (view) => set({ viewRef: view }),
  addedPoints: [],
  setAddedPoints: (points) =>
    set((state) => ({
      addedPoints: typeof points === 'function' ? points(state.addedPoints) : points
    }))
}))
