import { useEffect } from 'react'

import { basemapItems } from './constants'

interface MapComboBoxProps {
  isVisible: boolean
  updateBasemapStyle: (basemapId: string) => void
}

const MapComboBox: React.FC<MapComboBoxProps> = ({ isVisible, updateBasemapStyle }) => {
  useEffect(() => {
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
  }, [updateBasemapStyle])

  if (!isVisible) return null

  return (
    <div
      id="basemapStyles"
      className="esri-widget"
      style={{
        position: 'absolute',
        top: '72px',
        right: '10px',
        width: '195px',
        height: '48px',
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
  )
}

export default MapComboBox
