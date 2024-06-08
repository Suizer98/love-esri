import { Tooltip } from '@chakra-ui/react'
import { useEffect } from 'react'

import { useMapStore } from '../../../store/useMapStore'
import { useViewStore } from '../../../store/useViewStore'
import { basemapItems } from './constants'

interface MapComboBoxProps {
  updateBasemapStyle: (basemapId: string) => void
}

const MapComboBox: React.FC<MapComboBoxProps> = ({ updateBasemapStyle }) => {
  const { isSidebarVisible } = useViewStore()
  const { isMapAvailable } = useMapStore()

  useEffect(() => {
    const basemapStylesDiv = document.getElementById('basemapStyles')
    if (basemapStylesDiv) {
      const styleCombobox = basemapStylesDiv.querySelector('#styleCombobox') as HTMLDivElement
      if (styleCombobox) {
        const handleChange = (event: any) => {
          const selectedItem = event.target.selectedItems[0]
          if (selectedItem) {
            updateBasemapStyle(selectedItem.value)
          }
        }

        styleCombobox.addEventListener('calciteComboboxChange', handleChange)

        return () => {
          styleCombobox.removeEventListener('calciteComboboxChange', handleChange)
        }
      }
    }
  }, [updateBasemapStyle])

  if (!isMapAvailable || isSidebarVisible) return null

  return (
    <Tooltip label="Switch tile type" bg="black" placement="top">
      <div
        id="basemapStyles"
        className="esri-widget"
        style={{
          position: 'absolute',
          top: '130px',
          left: '8px',
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
    </Tooltip>
  )
}

export default MapComboBox
