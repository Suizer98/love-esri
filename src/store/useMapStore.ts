import create from 'zustand'

interface ViewTypeState {
  mapType: '2D' | '3D'
  switchMapType: (type: '2D' | '3D') => void
  routingMode: boolean
  toggleRoutingMode: () => void
  isMapAvailable: boolean
  setIsMapAvailable: (available: boolean) => void
}

export const useMapStore = create<ViewTypeState>((set) => ({
  mapType: '3D',
  switchMapType: (type) => set({ mapType: type }),
  routingMode: false,
  toggleRoutingMode: () => set((state) => ({ routingMode: !state.routingMode })),
  isMapAvailable: false,
  setIsMapAvailable: (available) => set({ isMapAvailable: available })
}))
