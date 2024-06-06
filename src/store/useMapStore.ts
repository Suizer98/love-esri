import create from 'zustand'

interface ViewTypeState {
  viewType: '2D' | '3D'
  switchView: (type: '2D' | '3D') => void
}

export const useMapStore = create<ViewTypeState>((set) => ({
  viewType: '3D', // default view
  switchView: (type) => set({ viewType: type })
}))
