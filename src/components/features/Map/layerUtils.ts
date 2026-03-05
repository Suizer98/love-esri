import Graphic from '@arcgis/core/Graphic'
import PopupTemplate from '@arcgis/core/PopupTemplate'
import Point from '@arcgis/core/geometry/Point'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer'
import Layer from '@arcgis/core/layers/Layer'
import SceneLayer from '@arcgis/core/layers/SceneLayer'
import esriRequest from '@arcgis/core/request'
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import * as satellite from 'satellite.js'

import { useLayersStore } from '../../../store/useLayersStore'
import { useMapStore } from '../../../store/useMapStore'

export const addLayerRecursively = () => {
  const { layers, addLayer } = useLayersStore.getState()
  const layerAddedRef = { current: false }

  if (!layerAddedRef.current) {
    if (!layers.some((layer) => layer.name === '3D Buildings')) {
      const layer = {
        name: '3D Buildings',
        url: 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/SF_BLDG_WSL1/SceneServer',
        visible: true,
        type: '3D'
      }
      addLayer(layer)
    }
    if (!layers.some((layer) => layer.name === '2D Flow')) {
      const layer = {
        name: '2D Flow',
        url: 'https://tiledimageservices.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/NLDAS_Hourly_8_30_2021/ImageServer',
        visible: true,
        type: '2D',
        renderer: {
          type: 'flow',
          trailWidth: '2px',
          density: 1,
          visualVariables: [
            {
              type: 'color',
              field: 'Magnitude',
              stops: [
                { color: [40, 146, 199, 1], value: 0 },
                { color: [160, 194, 155, 1], value: 5 },
                { color: [218, 230, 119, 1], value: 10 }
              ]
            }
          ]
        },
        effect: 'bloom(1.5, 0.5px, 0)'
      }
      addLayer(layer)
    }
    if (!layers.some((layer) => layer.name === 'Satellites')) {
      const layer = {
        name: 'Satellites',
        visible: true,
        type: 'GraphicsLayer'
      }
      addLayer(layer)
    }

    layerAddedRef.current = true
  }
}

export const addLayersToMap = async (
  view: MapView | SceneView,
  viewType: string,
  layers: any[]
): Promise<void> => {
  const map = view.map
  if (!map) return
  const loadPromises: Promise<void>[] = []

  layers.forEach((layer) => {
    let layerInstance: Layer | undefined
    if (viewType === '3D' && layer.name === '3D Buildings') {
      layerInstance = map.findLayerById(layer.name) as SceneLayer
      if (!layerInstance) {
        layerInstance = new SceneLayer({
          id: layer.name,
          url: layer.url
        })
        map.add(layerInstance)
        loadPromises.push(
          layerInstance.load().then(
            () => {},
            () => {}
          )
        )
      }
    } else if (viewType === '2D' && layer.name === '2D Flow') {
      layerInstance = map.findLayerById(layer.name) as ImageryTileLayer
      if (!layerInstance) {
        layerInstance = new ImageryTileLayer({
          id: layer.name,
          url: layer.url,
          renderer: layer.renderer,
          effect: layer.effect
        })
        map.add(layerInstance)
        loadPromises.push(
          layerInstance.load().then(
            () => {},
            () => {}
          )
        )
      }
    } else if (layer.type === 'GraphicsLayer' && layer.name === 'Satellites') {
      layerInstance = map.findLayerById(layer.name) as GraphicsLayer
      if (!layerInstance) {
        layerInstance = new GraphicsLayer({
          id: layer.name
        })
        map.add(layerInstance)
        loadPromises.push(
          layerInstance.load().then(
            () => {},
            () => {}
          )
        )
        loadSatelliteData(layerInstance as GraphicsLayer)
      }
    }

    if (layerInstance) {
      layerInstance.visible = layer.visible
      if (layer.visible) {
        loadPromises.push(
          view
            .whenLayerView(layerInstance)
            .then(() => {})
            .catch(() => {})
        )
      }
    }
  })

  await Promise.all(loadPromises)
  useMapStore.getState().setIsLayersLoading(false)
}

async function loadSatelliteData(satelliteLayer: GraphicsLayer) {
  const url = '/brightest.txt'

  try {
    const response = await esriRequest(url, { responseType: 'text' })
    const txt = response.data

    const lines = txt.split('\n')
    const count = Math.floor(lines.length / 3)

    for (let i = 0; i < count; i++) {
      const commonName = lines[i * 3 + 0]
      const line1 = lines[i * 3 + 1]
      const line2 = lines[i * 3 + 2]
      const time = Date.now()

      const satelliteLoc = getSatelliteLocation(new Date(time), line1, line2)
      if (satelliteLoc) {
        const template = new PopupTemplate({
          title: '{name}',
          content: 'Launch number {number} of {year}',
          actions: [
            {
              title: 'Show Satellite Track',
              id: 'track',
              className: 'esri-icon-globe',
              type: 'button'
            }
          ]
        })

        const graphic = new Graphic({
          geometry: new Point(satelliteLoc),
          symbol: new PictureMarkerSymbol({
            url: '/satellite.png',
            width: '48px',
            height: '48px'
          }),
          attributes: {
            name: commonName,
            year: new Date().getFullYear(),
            number: i,
            line1: line1,
            line2: line2
          },
          popupTemplate: template
        })

        satelliteLayer.add(graphic)
      }
    }
  } catch (error) {
    console.error('Error loading satellite data:', error)
  }
}

const getSatelliteLocation = (date: Date, line1: string, line2: string) => {
  const satrec = satellite.twoline2satrec(line1, line2)
  const position_and_velocity = satellite.propagate(satrec, date)
  const position_eci = position_and_velocity.position

  const gmst = satellite.gstime(date)

  if (!position_eci || position_eci === true) {
    return null
  }

  const position_gd = satellite.eciToGeodetic(position_eci, gmst)

  let longitude = position_gd.longitude
  const latitude = position_gd.latitude
  const height = position_gd.height

  if (isNaN(longitude) || isNaN(latitude) || isNaN(height)) {
    return null
  }

  const rad2deg = 180 / Math.PI
  while (longitude < -Math.PI) {
    longitude += 2 * Math.PI
  }
  while (longitude > Math.PI) {
    longitude -= 2 * Math.PI
  }

  return {
    x: rad2deg * longitude,
    y: rad2deg * latitude,
    z: height * 1000
  }
}
