import { useState } from 'react'

import { LoveEsriViewBar } from './view/LoveEsriViewBar'
import { LoveEsriViewSideBar } from './view/LoveEsriViewSideBar'

const LoveEsriApp = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible)
  }

  return (
    <>
      <LoveEsriViewBar onToggleSidebar={toggleSidebar} />
      <LoveEsriViewSideBar isVisible={isSidebarVisible} />
    </>
  )
}

export default LoveEsriApp
