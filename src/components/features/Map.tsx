import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Search from '@arcgis/core/widgets/Search'
import { useEffect } from 'react'

import { useMapStore } from '../../store/useMapStore'

const MapPort = () => {
  const basemapItems = [
    { value: 'arcgis/navigation', text: 'arcgis/navigation' },
    { value: 'arcgis/navigation-night', text: 'arcgis/navigation-night' },
    { value: 'arcgis/satellite', text: 'arcgis/satellite', selected: true },
    { value: 'arcgis/streets', text: 'arcgis/streets' },
    { value: 'arcgis/streets-relief', text: 'arcgis/streets-relief' },
    { value: 'arcgis/streets-night', text: 'arcgis/streets-night' },
    { value: 'arcgis/outdoor', text: 'arcgis/outdoor' },
    { value: 'arcgis/imagery', text: 'arcgis/imagery' },
    { value: 'arcgis/topographic', text: 'arcgis/topographic' },
    { value: 'arcgis/terrain', text: 'arcgis/terrain' },
    { value: 'arcgis/oceans', text: 'arcgis/oceans' },
    { value: 'arcgis/light-gray', text: 'arcgis/light-gray' },
    { value: 'arcgis/dark-gray', text: 'arcgis/dark-gray' },
    { value: 'arcgis/human-geography', text: 'arcgis/human-geography' },
    { value: 'arcgis/human-geography-dark', text: 'arcgis/human-geography-dark' },
    { value: 'arcgis/charted-territory', text: 'arcgis/charted-territory' },
    { value: 'arcgis/colored-pencil', text: 'arcgis/colored-pencil' },
    { value: 'arcgis/nova', text: 'arcgis/nova' },
    { value: 'arcgis/modern-antique', text: 'arcgis/modern-antique' },
    { value: 'arcgis/midcentury', text: 'arcgis/midcentury' },
    { value: 'arcgis/newspaper', text: 'arcgis/newspaper' },
    { value: 'osm/standard', text: 'osm/standard' },
    { value: 'osm/standard-relief', text: 'osm/standard-relief' },
    { value: 'osm/navigation', text: 'osm/navigation' },
    { value: 'osm/navigation-dark', text: 'osm/navigation-dark' },
    { value: 'osm/streets', text: 'osm/streets' },
    { value: 'osm/hybrid', text: 'osm/hybrid' },
    { value: 'osm/light-gray', text: 'osm/light-gray' },
    { value: 'osm/dark-gray', text: 'osm/dark-gray' },
    { value: 'osm/blueprint', text: 'osm/blueprint' }
  ]

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
