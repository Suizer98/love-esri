import Map from '@arcgis/core/Map'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import * as locator from '@arcgis/core/rest/locator'
import MapView from '@arcgis/core/views/MapView'
import Search from '@arcgis/core/widgets/Search'
import { queryDemographicData } from '@esri/arcgis-rest-demographics'
import { ApiKeyManager } from '@esri/arcgis-rest-request'
import { useEffect } from 'react'

const Playground = () => {
  useEffect(() => {
    const initializeMap = () => {
      const token = IdentityManager.findCredential('https://www.arcgis.com/sharing').token

      if (!token) return null
      const authentication = ApiKeyManager.fromKey(token)

      const map = new Map({
        basemap: 'arcgis/navigation'
      })

      const view = new MapView({
        map: map,
        center: [9.19, 45.4642], // Milan, Italy
        zoom: 4,
        container: 'viewDiv'
      })

      const search = new Search({
        view: view
      })
      view.ui.add(search, 'top-right')

      const getDemographicData = (point: any) => {
        queryDemographicData({
          studyAreas: [
            {
              geometry: {
                x: point.longitude,
                y: point.latitude
              }
            }
          ],
          authentication: authentication as any
        }).then((response) => {
          console.log(response)
        })
      }

      search.on('select-result', (event) => {
        if (!event.result) {
          return
        }
        getDemographicData(event.result.feature.geometry)
      })

      view.on('click', (e) => {
        const params = {
          location: e.mapPoint,
          outFields: '*'
        }
        const locatorUrl = 'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer'

        locator.locationToAddress(locatorUrl, params).then(
          () => {
            getDemographicData(params.location)
          },
          () => {
            view.graphics.removeAll()
            console.log('No address found.')
          }
        )
      })
    }

    initializeMap()
  }, [])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div id="viewDiv" style={{ height: '100%', width: '100%' }}></div>
    </div>
  )
}

export default Playground
