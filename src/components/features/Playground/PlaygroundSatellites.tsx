import Graphic from '@arcgis/core/Graphic'
import PopupTemplate from '@arcgis/core/PopupTemplate'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { PictureMarkerSymbol } from '@arcgis/core/symbols'
import * as d3 from 'd3'

export const loadSatelliteData = async (satelliteLayer: GraphicsLayer) => {
  const url = '/rinex210.csv'

  try {
    const data = await d3.csv(url)

    data.forEach((d: any, i: any) => {
      const commonName = `Satellite G${d.Sat} 1/5/2018`
      const latitude = parseScientific(d.Lat)
      const longitude = parseScientific(d.Lon)
      const altitude = parseScientific(d.Alt)

      if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(altitude)) {
        const satelliteLoc = {
          type: 'point',
          x: longitude,
          y: latitude,
          z: altitude
        } as __esri.GeometryProperties

        const template = new PopupTemplate({
          title: '{name}',
          content: 'Satellite G{number} with Altitude {altitude}',
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
          geometry: satelliteLoc,
          symbol: new PictureMarkerSymbol({
            url: '/satellite.png',
            width: '48px',
            height: '48px'
          }),
          attributes: {
            name: commonName,
            number: i,
            altitude: altitude
          },
          popupTemplate: template
        })

        satelliteLayer.add(graphic)
      }
    })
  } catch (error) {
    console.error('Error loading satellite data:', error)
  }
}

const parseScientific = (value: string): number => {
  if (!value) return NaN
  const scientificNotationRegex = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i
  if (scientificNotationRegex.test(value)) {
    return parseFloat(value)
  }
  return NaN
}
