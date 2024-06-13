import { Point } from '@arcgis/core/geometry'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { useCallback, useEffect } from 'react'

import { usePlaygroundStore } from '../../../store/usePlaygroundStore'

interface PlaygroundPointsProps {
  viewRef: React.MutableRefObject<MapView | SceneView | null>
}

const PlaygroundPoint: React.FC<PlaygroundPointsProps> = ({ viewRef }) => {
  const { pointMode, setAddedPoints } = usePlaygroundStore()

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

  return null
}

export default PlaygroundPoint
