// import { Tooltip } from '@chakra-ui/react'
// import { createRoot } from 'react-dom/client'
// import { usePlaygroundStore } from '../../../store/usePlaygroundStore'
// import { initializeTimeSlider, loadSatelliteData } from './PlaygroundSatellites'
// export const createRecenterButton = (
//   view: __esri.MapView | __esri.SceneView,
//   initialCamera: any,
//   satellitesLayer: any,
//   pointLayer: any
// ) => {
//   const { setViewRef, setIsPMapAvailable } = usePlaygroundStore.getState()
//   // Create and add the recenter button
//   const recenterButtonDiv = document.createElement('div')
//   recenterButtonDiv.className = 'recenter-button esri-widget--button esri-widget'
//   recenterButtonDiv.style.cursor = 'pointer'
//   const tooltipContainer = document.createElement('div')
//   createRoot(tooltipContainer).render(
//     <Tooltip label="Recenter" bg="black" color="white">
//       <div className="recenter-button esri-widget--button esri-widget">
//         <span className="esri-icon esri-icon-globe"></span>
//       </div>
//     </Tooltip>
//   )
//   recenterButtonDiv.appendChild(tooltipContainer)
//   view.ui.add(recenterButtonDiv, 'top-left')
//   recenterButtonDiv.addEventListener('click', () => {
//     setIsPMapAvailable(false)
//     // Remove the current view
//     // @ts-ignore
//     view.container = null
//     setViewRef(null)
//     // Reinitialize the view with the initial settings
//     const viewDiv = document.getElementById('viewDiv') as HTMLDivElement
//     // @ts-ignore
//     const newView = new view.constructor({
//       container: viewDiv,
//       map: view.map,
//       camera: initialCamera,
//       ui: {
//         components: []
//       }
//     })
//     setViewRef(newView)
//     newView.when(() => {
//       setIsPMapAvailable(true)
//       createRecenterButton2(newView, initialCamera, satellitesLayer, pointLayer)
//       // Load satellite data and initialize the time slider
//       loadSatelliteData()
//         .then((data) => {
//           initializeTimeSlider(newView, satellitesLayer, data)
//         })
//         .catch((error) => {
//           console.error('Error loading satellite data:', error)
//         })
//     })
//   })
// }
// export const createRecenterButton2 = (
//   view: __esri.MapView | __esri.SceneView,
//   initialCamera: any,
//   satellitesLayer: any,
//   pointLayer: any
// ) => {
//   const { setViewRef, setIsPMapAvailable } = usePlaygroundStore.getState()
//   // Create and add the recenter button
//   const recenterButtonDiv = document.createElement('div')
//   recenterButtonDiv.className = 'recenter-button esri-widget--button esri-widget'
//   recenterButtonDiv.style.cursor = 'pointer'
//   const tooltipContainer = document.createElement('div')
//   createRoot(tooltipContainer).render(
//     <Tooltip label="Recenter" bg="black" color="white">
//       <div className="recenter-button esri-widget--button esri-widget">
//         <span className="esri-icon esri-icon-globe"></span>
//       </div>
//     </Tooltip>
//   )
//   recenterButtonDiv.appendChild(tooltipContainer)
//   view.ui.add(recenterButtonDiv, 'top-left')
//   recenterButtonDiv.addEventListener('click', () => {
//     setIsPMapAvailable(false)
//     // Remove the current view
//     // @ts-ignore
//     view.container = null
//     setViewRef(null)
//     // Reinitialize the view with the initial settings
//     const viewDiv = document.getElementById('viewDiv') as HTMLDivElement
//     // @ts-ignore
//     const newView = new view.constructor({
//       container: viewDiv,
//       map: view.map,
//       camera: initialCamera,
//       ui: {
//         components: []
//       }
//     })
//     setViewRef(newView)
//     newView.when(() => {
//       setIsPMapAvailable(true)
//       createRecenterButton(newView, initialCamera, satellitesLayer, pointLayer)
//       // Load satellite data and initialize the time slider
//       loadSatelliteData()
//         .then((data) => {
//           initializeTimeSlider(newView, satellitesLayer, data)
//         })
//         .catch((error) => {
//           console.error('Error loading satellite data:', error)
//         })
//     })
//   })
// }
import { Tooltip } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'

export const createRecenterButton = (
  view: __esri.MapView | __esri.SceneView,
  initialCamera: any
) => {
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
  view.ui.add(recenterButtonDiv, 'top-left')

  recenterButtonDiv.addEventListener('click', () => {
    view.goTo(initialCamera)
  })
}
