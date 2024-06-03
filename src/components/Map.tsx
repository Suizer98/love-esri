import WebMap from '@arcgis/core/WebMap'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import MapView from '@arcgis/core/views/MapView'
import { useEffect } from 'react'

const Map = () => {
  useEffect(() => {
    const clientId = import.meta.env.CLIENT_ID
    // const clientSecret = import.meta.env.CLIENT_SECRET

    const info = new OAuthInfo({
      appId: clientId,
      portalUrl: 'https://www.arcgis.com',
      popup: false
    })

    IdentityManager.registerOAuthInfos([info])

    IdentityManager.getCredential(info.portalUrl + '/sharing')
      .then(() => {
        const webmap = new WebMap({
          portalItem: {
            id: 'your-webmap-id' // Replace with your actual WebMap ID
          }
        })

        const viewDiv = document.getElementById('viewDiv') as HTMLDivElement

        const view = new MapView({
          container: viewDiv,
          map: webmap
        })

        return () => {
          if (view) {
            view.container = null
          }
        }
      })
      .catch((error) => {
        console.error('Error getting credentials:', error)
      })
  }, [])

  return <div id="viewDiv" style={{ height: '100vh', width: '100vw' }}></div>
}

export default Map
