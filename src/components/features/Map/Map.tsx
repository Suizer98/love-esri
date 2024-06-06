import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Search from '@arcgis/core/widgets/Search'
import { useEffect } from 'react'

import { useMapStore } from '../../../store/useMapStore'
import { basemapItems } from './constants'

const MapPort = () => {
  const viewType = useMapStore((state) => state.viewType)

  useEffect(() => {
    const map = new Map({
      basemap: 'satellite',
      ground: 'world-elevation'
    })

    const viewDiv = document.getElementById('viewDiv') as HTMLDivElement

    let view: MapView | SceneView

    if (viewType === '3D') {
      view = new SceneView({
        container: viewDiv,
        scale: 123456789,
        map: map,
        center: [103, 1.5],
        ui: {
          components: []
        }
      })
    } else {
      view = new MapView({
        container: viewDiv,
        map: map,
        zoom: 5,
        center: [103, 1.5],
        ui: {
          components: []
        }
      })
    }

    const searchWidgetDiv = document.createElement('div')
    searchWidgetDiv.id = 'searchWidgetDiv'
    searchWidgetDiv.className = 'absolute top-2 left-2 p-2 z-10'
    view.ui.add(searchWidgetDiv)

    new Search({
      container: searchWidgetDiv,
      view: view
    })

    const updateBasemapStyle = (basemapId: string) => {
      view.map.basemap = new Basemap({
        style: {
          id: basemapId
        }
      })
    }

    const basemapStylesDiv = document.getElementById('basemapStyles')
    if (basemapStylesDiv) {
      const styleCombobox = basemapStylesDiv.querySelector('#styleCombobox') as HTMLDivElement
      if (styleCombobox) {
        styleCombobox.addEventListener('calciteComboboxChange', (event: any) => {
          const selectedItem = event.target.selectedItems[0]
          if (selectedItem) {
            updateBasemapStyle(selectedItem.value)
          }
        })
      }
    }

    return () => {
      if (view) {
        view.destroy()
      }
    }
  }, [viewType])

  return (
    <div id="viewDiv" style={{ height: '100%', width: '100%', padding: 0, margin: 0 }}>
      <div
        id="basemapStyles"
        className="esri-widget"
        style={{
          position: 'absolute',
          top: '70px',
          right: '10px',
          width: '250px',
          padding: '10px',
          zIndex: 5
        }}
      >
        <calcite-combobox id="styleCombobox" selection-mode="single" clear-disabled>
          {basemapItems.map((item) => (
            <calcite-combobox-item
              key={item.value}
              value={item.value}
              text-label={item.text}
              selected={item.selected || false}
            ></calcite-combobox-item>
          ))}
        </calcite-combobox>
      </div>
    </div>
  )
}

export default MapPort
