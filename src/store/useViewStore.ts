import create from 'zustand'

interface ViewStore {
  isSidebarVisible: boolean
  toggleSidebar: () => void
}

const useViewStore = create<ViewStore>((set) => ({
  isSidebarVisible: false,
  toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible }))
}))

export default useViewStore
