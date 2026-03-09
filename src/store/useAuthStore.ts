import esriConfig from '@arcgis/core/config'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import { create } from 'zustand'
import { hasLocalPortalCredentials, portalUrl } from '../config/arcgis'
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

    if (hasLocalPortalCredentials) {
      try {
        const credential = IdentityManager.findCredential(`${portalUrl}/sharing`)
        if (!credential) await signInToLocalPortal()
        const userInfo = await getPortalUser(portalUrl)
        if (!userInfo) throw new Error('No user')
        set({ user: userInfo })
        localStorage.setItem('user', JSON.stringify(userInfo))
        return 'success'
      } catch {
        // fall through to API key for arcgis.com
      }
    }

    const clientId = import.meta.env.VITE_CLIENT_ID
    const authPortalUrl = 'https://www.arcgis.com'
    const info = new OAuthInfo({
      appId: clientId,
      portalUrl: authPortalUrl,
      popup: false
    })
    IdentityManager.registerOAuthInfos([info])

    try {
      await IdentityManager.checkSignInStatus(`${authPortalUrl}/sharing`)
      const userInfo = await getPortalUser(authPortalUrl)
      if (!userInfo) throw new Error('No user')
      set({ user: userInfo })
      localStorage.setItem('user', JSON.stringify(userInfo))
      return 'success'
    } catch {
      if (apiKey) {
        esriConfig.apiKey = apiKey
        set({
          user: {
            username: 'Default User',
            role: 'Default'
          }
        })
        localStorage.setItem('user', JSON.stringify({ apiKey }))
        return 'no_sign_in_but_api_key'
      }
      set({ user: null })
      return 'error'
    }
  },

  signIn: async () => {
    try {
      const authPortalUrl = hasLocalPortalCredentials ? portalUrl : 'https://www.arcgis.com'
      if (hasLocalPortalCredentials) {
        await signInToLocalPortal()
      } else {
        const clientId = import.meta.env.VITE_CLIENT_ID
        const info = new OAuthInfo({
          appId: clientId,
          portalUrl: authPortalUrl,
          popup: false
        })
        IdentityManager.registerOAuthInfos([info])
        await IdentityManager.getCredential(`${authPortalUrl}/sharing`)
      }
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
