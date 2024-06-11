import create from 'zustand'

// Define the state interface for layers
interface Layer {
  name: string
  visible: boolean
  url?: string
  renderer?: any
  effect?: string
  type?: string
}

interface LayersState {
  layers: Layer[]
  addLayer: (layer: Layer) => void
  removeLayer: (name: string) => void
  toggleLayerVisibility: (name: string) => void
  clearLayers: () => void
}

// Create the Zustand store for layers
export const useLayersStore = create<LayersState>((set) => ({
  layers: [],
  addLayer: (layer) =>
    set((state) => ({ layers: [...state.layers, { ...layer, visible: false }] })),
  removeLayer: (name) => set((state) => ({ layers: state.layers.filter((l) => l.name !== name) })),
  toggleLayerVisibility: (name) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.name === name ? { ...layer, visible: !layer.visible } : layer
      )
    })),
  clearLayers: () => set({ layers: [] })
}))
