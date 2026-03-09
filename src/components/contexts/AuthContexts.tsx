import esriConfig from '@arcgis/core/config'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { hasLocalPortalCredentials, isLocalPortal, portalUrl } from '../../config/arcgis'
import { getPortalUser, signInToLocalPortal } from '../../lib/localPortalAuth'

interface AuthContextProps {
  user: any
  signIn: () => void
  signOut: () => void
}

interface AuthProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  signIn: () => {},
  signOut: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (!user) {
      const apiKey = import.meta.env.VITE_ESRI_API
      const clientId = import.meta.env.VITE_CLIENT_ID
      const portalClientId = import.meta.env.VITE_ARCGIS_PORTAL_CLIENT_ID
      if (isLocalPortal) {
        const doAuth = hasLocalPortalCredentials
          ? (IdentityManager.findCredential(`${portalUrl}/sharing`) ? Promise.resolve() : signInToLocalPortal())
          : portalClientId
            ? (IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: portalClientId, portalUrl, popup: false })]), IdentityManager.checkSignInStatus(`${portalUrl}/sharing`))
            : Promise.reject(new Error('Set VITE_ARCGIS_PORTAL_USER and VITE_ARCGIS_PORTAL_PASSWORD in .env, or set VITE_ARCGIS_PORTAL_CLIENT_ID'))
        doAuth
          .then(() => getPortalUser(portalUrl))
          .then((userInfo) => {
            if (!userInfo) return
            setUser(userInfo)
            localStorage.setItem('user', JSON.stringify(userInfo))
          })
          .catch(() => setUser(null))
      } else if (apiKey) {
        esriConfig.apiKey = apiKey
        setUser({ username: 'Default User', role: 'Default' })
        localStorage.setItem('user', JSON.stringify({ apiKey }))
      } else if (clientId) {
        const authPortalUrl = 'https://www.arcgis.com'
        IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: clientId, portalUrl: authPortalUrl, popup: false })])
        IdentityManager.checkSignInStatus(`${authPortalUrl}/sharing`)
          .then(() => getPortalUser(authPortalUrl))
          .then((userInfo) => {
            if (!userInfo) return
            setUser(userInfo)
            localStorage.setItem('user', JSON.stringify(userInfo))
          })
          .catch(() => setUser(null))
      }
    }
  }, [user])

  const signIn = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID
    const portalClientId = import.meta.env.VITE_ARCGIS_PORTAL_CLIENT_ID
    const authPromise = isLocalPortal
      ? hasLocalPortalCredentials
        ? signInToLocalPortal()
        : portalClientId
          ? (IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: portalClientId, portalUrl, popup: false })]), IdentityManager.getCredential(`${portalUrl}/sharing`))
          : Promise.reject(new Error('Set VITE_ARCGIS_PORTAL_USER and VITE_ARCGIS_PORTAL_PASSWORD in .env, or set VITE_ARCGIS_PORTAL_CLIENT_ID'))
      : clientId
        ? (IdentityManager.registerOAuthInfos([new OAuthInfo({ appId: clientId, portalUrl: 'https://www.arcgis.com', popup: false })]), IdentityManager.getCredential('https://www.arcgis.com/sharing'))
        : Promise.reject(new Error('VITE_CLIENT_ID required'))
    const authPortalUrl = isLocalPortal ? portalUrl : 'https://www.arcgis.com'
    authPromise
      .then(() => getPortalUser(authPortalUrl))
      .then((userInfo) => {
        if (!userInfo) return
        setUser(userInfo)
        localStorage.setItem('user', JSON.stringify(userInfo))
      })
      .catch(() => setUser(null))
  }

  const signOut = () => {
    IdentityManager.destroyCredentials()
    setUser(null)
    localStorage.removeItem('user')
    window.location.reload()
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}
