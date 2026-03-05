/**
 * Direct copy of the ArcGIS AI Assistant sample from the documentation.
 * https://developers.arcgis.com/javascript/latest/references/ai-components/components/arcgis-assistant/
 *
 * Sample HTML structure (adapted to React, no calcite-shell):
 *   <arcgis-map id="wheat-map" item-id="c13bffcad4a244a99062e915e9bc1dc3">...</arcgis-map>
 *   <arcgis-assistant reference-element="#wheat-map" ...>
 *     suggestedPrompts set via script after load
 */
import { useEffect, useRef } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/ai-components/components/arcgis-assistant'
import '@arcgis/ai-components/components/arcgis-assistant-navigation-agent'
import '@arcgis/ai-components/components/arcgis-assistant-data-exploration-agent'
import '@arcgis/ai-components/components/arcgis-assistant-help-agent'

function AiPageSample() {
  const assistantRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const assistantElement = assistantRef.current
    if (assistantElement && 'suggestedPrompts' in assistantElement) {
      ;(assistantElement as { suggestedPrompts: string[] }).suggestedPrompts = [
        'Go to the county that produced the most wheat in 2022.',
        'How does that compare to the average county that produced wheat?',
        'How many counties produced less wheat in 2022 than in 2017?'
      ]
    }
  }, [])

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <arcgis-map
          id="wheat-map"
          itemId="c13bffcad4a244a99062e915e9bc1dc3"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div style={{ width: '400px', flexShrink: 0, overflow: 'auto' }}>
        <arcgis-assistant
          ref={assistantRef as React.RefObject<HTMLElement>}
          referenceElement="#wheat-map"
          logEnabled
          copyEnabled
          heading="Change in wheat production 2017-2022"
          description="Explore wheat production in the U.S. from 2017 to 2022."
          entryMessage="Hello! I'm here to help you explore changes in wheat production over the years."
        >
          <arcgis-assistant-navigation-agent />
          <arcgis-assistant-data-exploration-agent />
          <arcgis-assistant-help-agent />
        </arcgis-assistant>
      </div>
    </div>
  )
}

export default AiPageSample
