import Graphic from '@arcgis/core/Graphic'
import { Point } from '@arcgis/core/geometry'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { useCallback, useEffect } from 'react'

import { usePlaygroundStore } from '../../../store/usePlaygroundStore'

interface PlaygroundPointsProps {
  viewRef: React.MutableRefObject<MapView | SceneView | null>
}

const PlaygroundPoint: React.FC<PlaygroundPointsProps> = ({ viewRef }) => {
  const { pointMode, addedPoints, setAddedPoints } = usePlaygroundStore()

  const handleClick = useCallback(
    (event: any) => {
      if (viewRef.current) {
        const point = new Point({
          longitude: event.mapPoint.longitude,
          latitude: event.mapPoint.latitude
        })
        setAddedPoints((prevPoints) => [...prevPoints, point])
      }
    },
    [setAddedPoints, viewRef]
  )

  useEffect(() => {
    let handle: __esri.Handle | undefined

    if (pointMode && viewRef.current) {
      handle = viewRef.current.on('click', handleClick)
    } else if (viewRef.current) {
      // viewRef.current.graphics.removeAll()
      // setAddedPoints([])
    }

    return () => {
      if (handle) {
        handle.remove()
      }
    }
  }, [pointMode, handleClick, setAddedPoints, viewRef])

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.graphics.removeAll()
      addedPoints.forEach((point) => {
        const symbol = new SimpleMarkerSymbol({
          color: 'blue',
          size: '8px'
        })
        const graphic = new Graphic({
          geometry: point,
          symbol: symbol
        })
        viewRef.current!.graphics.add(graphic)
      })
    }
  }, [addedPoints, viewRef])

  return null
}

export default PlaygroundPoint
