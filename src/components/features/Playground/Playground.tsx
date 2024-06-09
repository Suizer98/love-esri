import Graphic from '@arcgis/core/Graphic'
import Map from '@arcgis/core/Map'
import esriConfig from '@arcgis/core/config'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import { geodesicBuffer } from '@arcgis/core/geometry/geometryEngine'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import * as locator from '@arcgis/core/rest/locator'
import SceneView from '@arcgis/core/views/SceneView'
import Expand from '@arcgis/core/widgets/Expand'
import Search from '@arcgis/core/widgets/Search'
import { Box, useColorMode } from '@chakra-ui/react'
import { queryDemographicData } from '@esri/arcgis-rest-demographics'
import { useEffect, useRef } from 'react'

const Playground = () => {
  const mapDiv = useRef<HTMLDivElement | null>(null)
  const { colorMode } = useColorMode()

  useEffect(() => {
    const setupOAuth = () => {
      const info = new OAuthInfo({
        appId: 'YOUR_APP_ID', // Replace with your app's client ID
        portalUrl: 'https://www.arcgis.com', // Replace with your portal URL if using ArcGIS Enterprise
        popup: true
      })
      esriConfig.portalUrl = 'https://www.arcgis.com' // Set the portal URL

      IdentityManager.registerOAuthInfos([info])

      IdentityManager.checkSignInStatus(info.portalUrl + '/sharing')
        .then((userCredential) => {
          initializeMap(userCredential.token)
        })
        .catch(() => {
          IdentityManager.getCredential(info.portalUrl + '/sharing')
        })
    }

    const initializeMap = (token: string) => {
      if (!mapDiv.current) return

      const map = new Map({
        basemap: 'arcgis-imagery'
      })

      const view = new SceneView({
        container: mapDiv.current,
        map: map,
        center: [9.19, 45.4642], // Milan, Italy
        zoom: 3
      })

      const search = new Search({
        view: view
      })

      view.ui.add(
        new Expand({
          view: view,
          content: search,
          expanded: true,
          mode: 'floating'
        }),
        'top-right'
      )

      view.when(() => {
        reactiveUtils.watch(
          () => search.activeSource,
          (loaded) => {
            if (loaded) {
              search.popupEnabled = false
              search.activeSource.placeholder = 'Search for cities or places'
              getDemographicsForCity(null, view.center, token)
            }
          },
          { once: true }
        )
      })

      search.on('select-result', (result) => {
        if (!result.result) return
        const point = result.result.feature.geometry as __esri.Point // Type assertion
        view.popup.close()
        getDemographicsForCity(result.result.name, point, token)
      })

      view.on('click', (e) => {
        const point = e.mapPoint as __esri.Point // Type assertion
        getDemographicsForCity(null, point, token)
      })

      const geocodingServiceUrl =
        'https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer'

      function getDemographicsForCity(city: string | null, point: __esri.Point, token: string) {
        if (!search.activeSource) return
        if (city) {
          getDemographicData(city, point, token)
        } else {
          const params = { location: point, outFields: '*' }
          locator.locationToAddress(geocodingServiceUrl, params).then(
            (response) => {
              const address: any = response.address // Explicitly define as 'any'
              const city = address.City || address.Region
              getDemographicData(city, point, token)
            },
            () => {
              view.graphics.removeAll()
              console.log('No address found.')
            }
          )
        }
      }

      function getDemographicData(city: string, point: __esri.Point, token: string) {
        queryDemographicData({
          studyAreas: [{ geometry: { x: point.longitude, y: point.latitude } }],
          authentication: {
            getToken: () => Promise.resolve(token),
            portal: 'https://www.arcgis.com'
          }
        })
          .then((response: any) => {
            if (
              response.results &&
              response.results[0].value.FeatureSet.length > 0 &&
              response.results[0].value.FeatureSet[0].features.length > 0
            ) {
              const attributes = response.results[0].value.FeatureSet[0].features[0].attributes
              showData(city, attributes, point)
            } else {
              console.log('No data found.')
            }
          })
          .catch((error) => {
            console.error('Error fetching demographic data:', error)
          })
      }

      function showData(city: string, attributes: any, point: __esri.Point) {
        if (!city || !attributes || !point) return

        const title = `Global facts near ${city}`
        const content = `Population: ${attributes.TOTPOP}<br>Males: ${attributes.TOTMALES} <br>Females: ${attributes.TOTFEMALES}<br>Average Household Size: ${attributes.AVGHHSZ}`

        view.popup.open({
          location: point,
          title: title,
          content: content
        })

        const buffer = geodesicBuffer(point, 1, 'miles') as __esri.Polygon
        const graphicBuffer = new Graphic({
          geometry: buffer,
          symbol: {
            type: 'simple-fill',
            color: [50, 50, 50, 0.1],
            outline: { color: [0, 0, 0, 0.25], width: 0.5 },
            style: 'solid'
          } as any
        })
        view.graphics.removeAll()
        view.graphics.add(graphicBuffer)
      }
    }

    setupOAuth()
  }, [colorMode])

  return <Box ref={mapDiv} w="100%" h="100%" />
}

export default Playground
