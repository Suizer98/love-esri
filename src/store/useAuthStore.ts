import esriConfig from '@arcgis/core/config'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import { create } from 'zustand'
import { hasLocalPortalCredentials, isLocalPortal, portalUrl } from '../config/arcgis'
import { getPortalUser, signInToLocalPortal } from '../lib/localPortalAuth'

interface AuthState {
  user: any
  signIn: () => void
  signOut: () => void
  checkExistingSession: () => Promise<string>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  checkExistingSession: async (): Promise<string> => {
    const apiKey = import.meta.env.VITE_ESRI_API
    const clientId = import.meta.env.VITE_CLIENT_ID

    // Custom portal: always require credentials (env user/pass or OAuth for that portal)
    if (isLocalPortal) {
      try {
        if (hasLocalPortalCredentials) {
          const credential = IdentityManager.findCredential(`${portalUrl}/sharing`)
          if (!credential) await signInToLocalPortal()
        } else {
          const portalClientId = import.meta.env.VITE_ARCGIS_PORTAL_CLIENT_ID
          if (!portalClientId || portalClientId === 'arcgisonline') throw new Error('Set VITE_ARCGIS_PORTAL_CLIENT_ID to the client ID of an OAuth app registered on your portal. Do not use "arcgisonline".')
          IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: portalClientId, portalUrl, popup: false })])
          await IdentityManager.checkSignInStatus(`${portalUrl}/sharing`)
        }
        const userInfo = await getPortalUser(portalUrl)
        if (!userInfo) throw new Error('No user')
        set({ user: userInfo })
        localStorage.setItem('user', JSON.stringify(userInfo))
        return 'success'
      } catch {
        set({ user: null })
        return 'error'
      }
    }

    // arcgis.com: if API key set, use it as default (no prompt)
    if (apiKey) {
      esriConfig.apiKey = apiKey
      set({ user: { username: 'Default User', role: 'Default' } })
      localStorage.setItem('user', JSON.stringify({ apiKey }))
      return 'no_sign_in_but_api_key'
    }

    // arcgis.com, no API key: require normal OAuth
    try {
      if (!clientId) throw new Error('VITE_CLIENT_ID or VITE_ESRI_API required')
      const authPortalUrl = 'https://www.arcgis.com'
      IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: clientId, portalUrl: authPortalUrl, popup: false })])
      await IdentityManager.checkSignInStatus(`${authPortalUrl}/sharing`)
      const userInfo = await getPortalUser(authPortalUrl)
      if (!userInfo) throw new Error('No user')
      set({ user: userInfo })
      localStorage.setItem('user', JSON.stringify(userInfo))
      return 'success'
    } catch {
      set({ user: null })
      return 'error'
    }
  },

  signIn: async () => {
    try {
      const clientId = import.meta.env.VITE_CLIENT_ID
      const portalClientId = import.meta.env.VITE_ARCGIS_PORTAL_CLIENT_ID
      if (isLocalPortal) {
        if (hasLocalPortalCredentials) {
          await signInToLocalPortal()
        } else {
          // VITE_ARCGIS_PORTAL_CLIENT_ID must be the real client ID from an OAuth app registered ON YOUR PORTAL (not "arcgisonline" or VITE_CLIENT_ID).
          if (!portalClientId || portalClientId === 'arcgisonline') throw new Error('Set VITE_ARCGIS_PORTAL_CLIENT_ID to the client ID of an OAuth app registered on your portal (Portal → OAuth 2.0). Do not use "arcgisonline" or your ArcGIS Online app ID.')
          IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: portalClientId, portalUrl, popup: false })])
          await IdentityManager.getCredential(`${portalUrl}/sharing`)
        }
        const userInfo = await getPortalUser(portalUrl)
        if (!userInfo) return
        set({ user: userInfo })
        localStorage.setItem('user', JSON.stringify(userInfo))
        return
      }
      const authPortalUrl = 'https://www.arcgis.com'
      if (!clientId) throw new Error('VITE_CLIENT_ID required')
      IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: clientId, portalUrl: authPortalUrl, popup: false })])
      await IdentityManager.getCredential(`${authPortalUrl}/sharing`)
      const userInfo = await getPortalUser(authPortalUrl)
      if (!userInfo) return
      set({ user: userInfo })
      localStorage.setItem('user', JSON.stringify(userInfo))
    } catch {
      set({ user: null })
    }
  },

  signOut: () => {
    IdentityManager.destroyCredentials()
    set({ user: null })
    localStorage.removeItem('user')
    // window.location.reload()
  }
}))
