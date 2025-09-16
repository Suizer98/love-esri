import Graphic from '@arcgis/core/Graphic'
import PopupTemplate from '@arcgis/core/PopupTemplate'
import TimeExtent from '@arcgis/core/TimeExtent'
import TimeInterval from '@arcgis/core/TimeInterval'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { PictureMarkerSymbol } from '@arcgis/core/symbols'
import TimeSlider from '@arcgis/core/widgets/TimeSlider'
import * as d3 from 'd3'

// Load both CSV files and combine the data
export const loadSatelliteData = async (): Promise<any[]> => {
  const urls = ['/chur1610.csv']
  let combinedData: any[] = []

  try {
    for (const url of urls) {
      const data = await d3.csv(url)
      combinedData = combinedData.concat(data)
    }
    return combinedData
  } catch (error) {
    console.error('Error loading satellite data:', error)
    return []
  }
}

// Filter data based on the time extent and update the satellite layer
export const updateSatelliteLayer = (
  satelliteLayer: GraphicsLayer,
  data: any[],
  timeExtent: __esri.TimeExtent
) => {
  satelliteLayer.removeAll()

  // Convert timeExtent to UTC
  const timeExtentStartUTC = new Date(
    timeExtent.start.getTime() - timeExtent.start.getTimezoneOffset() * 60000
  )
  const timeExtentEndUTC = new Date(
    timeExtent.end.getTime() - timeExtent.end.getTimezoneOffset() * 60000
  )

  data.forEach((d: any, i: any) => {
    const date = new Date(d.Date)
    const dateUTC = new Date(date.getTime() - date.getTimezoneOffset() * 60000)

    if (dateUTC >= timeExtentStartUTC && dateUTC <= timeExtentEndUTC) {
      const commonName = `Satellite G${d.Sat} ${d.Date}`
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
            url: '/satellite2.png',
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
    }
  })
}

const parseScientific = (value: string): number => {
  if (!value) return NaN
  const scientificNotationRegex = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i
  if (scientificNotationRegex.test(value)) {
    return parseFloat(value)
  }
  return NaN
}

export const initializeTimeSlider = (
  view: __esri.SceneView,
  satellitesLayer: GraphicsLayer,
  data: any[]
) => {
  if (data.length > 0) {
    // Sort data by date to get first and last timestamps
    const sortedData = [...data].sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()
    )

    const firstTimestamp = new Date(sortedData[0].Date)
    const lastTimestamp = new Date(sortedData[sortedData.length - 1].Date)

    const timeSlider = new TimeSlider({
      container: 'timeSliderDiv',
      view: view,
      timeVisible: true,
      loop: true,
      fullTimeExtent: new TimeExtent({
        start: firstTimestamp,
        end: lastTimestamp
      }),
      stops: {
        interval: new TimeInterval({
          value: 15,
          unit: 'minutes'
        })
      }
    })

    view.ui.add(timeSlider, 'bottom-left')

    timeSlider.watch('timeExtent', (newTimeExtent) => {
      updateSatelliteLayer(satellitesLayer, data, newTimeExtent)
    })

    updateSatelliteLayer(satellitesLayer, data, timeSlider.fullTimeExtent)
  } else {
    console.error('No data loaded.')
  }
}
