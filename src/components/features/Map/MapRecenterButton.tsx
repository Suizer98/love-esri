import { Tooltip } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'

export const createRecenterButton = (view: __esri.MapView | __esri.SceneView) => {
  // Create and add the recenter button
  const recenterButtonDiv = document.createElement('div')
  recenterButtonDiv.className = 'recenter-button esri-widget--button esri-widget'
  const tooltipContainer = document.createElement('div')
  createRoot(tooltipContainer).render(
    <Tooltip label="Recenter" bg="black" color="white">
      <div
        className="recenter-button esri-widget--button esri-widget"
        style={{ cursor: 'pointer' }}
      >
        <span className="esri-icon esri-icon-globe"></span>
      </div>
    </Tooltip>
  )
  recenterButtonDiv.appendChild(tooltipContainer)
  view.ui.add(recenterButtonDiv, 'bottom-left')

  recenterButtonDiv.addEventListener('click', () => {
    if (view.type === '3d') {
      view.goTo({ center: [-96.0005, 39.0005], zoom: 3, heading: 0, tilt: 0 })
    } else {
      view.goTo({ center: [-96.0005, 39.0005], zoom: 3, rotation: 0 })
    }
  })
}
