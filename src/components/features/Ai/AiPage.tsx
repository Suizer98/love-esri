import { useEffect, useRef, useState } from 'react'
import '@arcgis/map-components/components/arcgis-map'
import LoadingOverlay from '../Loading'
import '@arcgis/ai-components/components/arcgis-assistant'
import '@arcgis/ai-components/components/arcgis-assistant-navigation-agent'
import '@arcgis/ai-components/components/arcgis-assistant-data-exploration-agent'
import '@arcgis/ai-components/components/arcgis-assistant-help-agent'

export default function AiPage() {
  const [mapReady, setMapReady] = useState(false)
  const assistantRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const mapEl = document.getElementById('ai-map') as HTMLElement & { viewOnReady?(): Promise<void> } | null
    if (!mapEl) return
    const ready = mapEl.viewOnReady ? mapEl.viewOnReady() : Promise.resolve()
    ready.then(() => setMapReady(true)).catch(() => setMapReady(true))
  }, [])

  useEffect(() => {
    if (!mapReady) return
    const mapEl = document.getElementById('ai-map')
    const assistantEl = assistantRef.current
    if (mapEl && assistantEl && 'referenceElement' in assistantEl) {
      ;(assistantEl as { referenceElement: HTMLElement | string | null }).referenceElement = mapEl
    }
  }, [mapReady])

  useEffect(() => {
    if (!mapReady) return
    const t = setTimeout(() => {
      const mapEl = document.getElementById('ai-map')
      const assistantEl = assistantRef.current
      if (mapEl && assistantEl && 'referenceElement' in assistantEl) {
        ;(assistantEl as { referenceElement: HTMLElement | string | null }).referenceElement = mapEl
      }
    }, 100)
    return () => clearTimeout(t)
  }, [mapReady])

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', position: 'relative' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <arcgis-map
          id="ai-map"
          // itemId="8ab4c20017c44cffa3ad4b2aeacc7d08"
          // itemId="c13bffcad4a244a99062e915e9bc1dc3"
          // itemId="d332353ba546475a9ce6f6c75dd4c06c"
          itemId="d8a2aeccabda42e299d01cadc4a4f8ae"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {!mapReady && <LoadingOverlay />}
      {mapReady && (
        <div style={{ width: '400px', flexShrink: 0, overflow: 'auto' }}>
          <arcgis-assistant
            ref={assistantRef as React.RefObject<HTMLElement>}
            referenceElement="#ai-map"
            suggestedPrompts={['Zoom to Singapore', 'What layers are on this map?', 'Go to my location']}
            logEnabled
            copyEnabled
            heading="Experimental Beta AI Assistant from version 5"
            description="Experimental Beta AI Assistant from version 5. Explore and navigate the map using natural language."
            entryMessage="Hi! I can help you navigate the map and answer questions. Try zooming somewhere or asking about the map."
          >
            <arcgis-assistant-navigation-agent />
            <arcgis-assistant-data-exploration-agent />
            <arcgis-assistant-help-agent />
          </arcgis-assistant>
        </div>
      )}
    </div>
  )
}
