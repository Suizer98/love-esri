import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Search from '@arcgis/core/widgets/Search'

export const createSearchWidget = (view: MapView | SceneView) => {
  const searchWidgetDiv = document.createElement('div')
  searchWidgetDiv.id = 'searchWidgetDiv'
  searchWidgetDiv.className = 'absolute top-4 left-2 p-2 z-10'
  view.ui.add(searchWidgetDiv)

  const searchWidget = new Search({
    container: searchWidgetDiv,
    view: view
  })

  searchWidget.on('search-complete', function () {
    if (view.popup) {
      view.popup.dockEnabled = false
      if ('collapseEnabled' in view.popup) {
        (view.popup as { collapseEnabled: boolean }).collapseEnabled = false
      }
    }
  })
}
