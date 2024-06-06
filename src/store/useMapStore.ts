import create from 'zustand'

interface ViewTypeState {
  viewType: '2D' | '3D'
  switchView: (type: '2D' | '3D') => void
  routingMode: boolean
  toggleRoutingMode: () => void
}

export const useMapStore = create<ViewTypeState>((set) => ({
  viewType: '3D', // default view
  switchView: (type) => set({ viewType: type }),
  routingMode: false, // default routing mode
  toggleRoutingMode: () => set((state) => ({ routingMode: !state.routingMode }))
}))
