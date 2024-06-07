import create from 'zustand'

interface ViewStore {
  isSidebarVisible: boolean
  isDesktopMode: boolean
  toggleSidebar: () => void
  setIsDesktopMode: (value: boolean) => void
}

const useViewStore = create<ViewStore>((set) => ({
  isSidebarVisible: false,
  isDesktopMode: false,
  toggleSidebar: () => set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
  setIsDesktopMode: (value) => set({ isDesktopMode: value })
}))

export default useViewStore
