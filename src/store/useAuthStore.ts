import esriConfig from '@arcgis/core/config'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import Portal from '@arcgis/core/portal/Portal'
import { create } from 'zustand'

interface AuthState {
  user: any
  signIn: () => void
  signOut: () => void
  checkExistingSession: () => Promise<string>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  checkExistingSession: async (): Promise<string> => {
    const clientId = import.meta.env.VITE_CLIENT_ID
    const apiKey = import.meta.env.VITE_ESRI_API

    const info = new OAuthInfo({
      appId: clientId,
      portalUrl: 'https://www.arcgis.com',
      popup: false
    })

    IdentityManager.registerOAuthInfos([info])

    // If not log in, use api key defined in env, this can be removed anytime
    try {
      await IdentityManager.checkSignInStatus(`${info.portalUrl}/sharing`)
      const portal = new Portal()
      await portal.load()
      const user = portal.user
      const userInfo = {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
      set({ user: userInfo })
      localStorage.setItem('user', JSON.stringify(userInfo))
      return 'success'
    } catch (error) {
      // If the user is not signed in, use the API key
      if (apiKey) {
        esriConfig.apiKey = apiKey

        const userInfo = {
          username: 'Default User',
          role: 'Default'
        }
        set({ user: userInfo })
        localStorage.setItem('user', JSON.stringify({ apiKey }))
        return 'no_sign_in_but_api_key'
      } else {
        set({ user: null })
        return 'error'
      }
    }
  },

  signIn: async () => {
    const clientId = import.meta.env.VITE_CLIENT_ID

    const info = new OAuthInfo({
      appId: clientId,
      portalUrl: 'https://www.arcgis.com',
      popup: false
    })

    IdentityManager.registerOAuthInfos([info])

    try {
      await IdentityManager.getCredential('https://www.arcgis.com/sharing')
      const portal = new Portal()
      await portal.load()
      const user = portal.user
      const userInfo = {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
      set({ user: userInfo })
      localStorage.setItem('user', JSON.stringify(userInfo))
    } catch (error) {
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
