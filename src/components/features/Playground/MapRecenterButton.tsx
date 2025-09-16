import { Tooltip } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'

// Recenter button that resets the camera to the initial position
export const createRecenterButton = (
  view: __esri.MapView | __esri.SceneView,
  initialCamera: any
) => {
  // Create and add the recenter button
  const recenterButtonDiv = document.createElement('div')
  recenterButtonDiv.className = 'recenter-button esri-widget--button esri-widget'
  recenterButtonDiv.style.cursor = 'pointer'
  const tooltipContainer = document.createElement('div')
  createRoot(tooltipContainer).render(
    <Tooltip label="Recenter" bg="black" color="white">
      <div className="recenter-button esri-widget--button esri-widget">
        <span className="esri-icon esri-icon-globe"></span>
      </div>
    </Tooltip>
  )
  recenterButtonDiv.appendChild(tooltipContainer)
  view.ui.add(recenterButtonDiv, 'top-left')
  recenterButtonDiv.addEventListener('click', () => {
    view.goTo(initialCamera)
  })
}

// The original recenter button
// import { Tooltip } from '@chakra-ui/react'
// import { createRoot } from 'react-dom/client'

// export const createRecenterButton = (
//   view: __esri.MapView | __esri.SceneView,
//   initialCamera: any
// ) => {
//   // Create and add the recenter button
//   const recenterButtonDiv = document.createElement('div')
//   recenterButtonDiv.className = 'recenter-button esri-widget--button esri-widget'
//   const tooltipContainer = document.createElement('div')
//   createRoot(tooltipContainer).render(
//     <Tooltip label="Recenter" bg="black" color="white">
//       <div
//         className="recenter-button esri-widget--button esri-widget"
//         style={{ cursor: 'pointer' }}
//       >
//         <span className="esri-icon esri-icon-globe"></span>
//       </div>
//     </Tooltip>
//   )
//   recenterButtonDiv.appendChild(tooltipContainer)
//   view.ui.add(recenterButtonDiv, 'top-left')

//   recenterButtonDiv.addEventListener('click', () => {
//     view.goTo(initialCamera)
//   })
// }
