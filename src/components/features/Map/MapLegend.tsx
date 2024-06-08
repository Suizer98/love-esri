import Legend from '@arcgis/core/widgets/Legend'
import React, { useEffect, useRef } from 'react'

interface LegendWidgetProps {
  view: __esri.MapView | __esri.SceneView
}

const MapLegend: React.FC<LegendWidgetProps> = ({ view }) => {
  const legendRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (view && legendRef.current) {
      const legend = new Legend({
        view: view,
        container: legendRef.current
      })

      view.ui.add(legend, 'bottom-right')

      return () => {
        view.ui.remove(legend)
        legend.destroy()
      }
    }
  }, [view])

  return <div ref={legendRef} className="legend-widget esri-widget" />
}

export default MapLegend
