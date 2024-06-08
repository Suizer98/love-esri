import Search from '@arcgis/core/widgets/Search'

export const createSearchWidget = (view: __esri.MapView | __esri.SceneView) => {
  const searchWidgetDiv = document.createElement('div')
  searchWidgetDiv.id = 'searchWidgetDiv'
  searchWidgetDiv.className = 'absolute top-4 left-2 p-2 z-10'
  view.ui.add(searchWidgetDiv)

  const searchWidget = new Search({
    container: searchWidgetDiv,
    view: view
  })

  searchWidget.on('search-complete', function () {
    // Remove the docking functionality
    view.popup.dockEnabled = false
    view.popup.collapseEnabled = false
  })
}
