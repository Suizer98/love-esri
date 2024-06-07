import useViewStore from '../store/useViewStore'
import { LoveEsriViewBar } from './view/LoveEsriViewBar'
import { LoveEsriViewSideBar } from './view/LoveEsriViewSideBar'

const LoveEsriApp = () => {
  const { isSidebarVisible, toggleSidebar } = useViewStore()

  return (
    <>
      <LoveEsriViewBar onToggleSidebar={toggleSidebar} />
      <LoveEsriViewSideBar isVisible={isSidebarVisible} />
    </>
  )
}

export default LoveEsriApp
