import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { hasLocalPortalCredentials, portalUrl } from '../../config/arcgis'
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
      if (hasLocalPortalCredentials) {
        const credential = IdentityManager.findCredential(`${portalUrl}/sharing`)
        const doLocalSignIn = credential
          ? Promise.resolve()
          : signInToLocalPortal()
        doLocalSignIn
          .then(() => getPortalUser(portalUrl))
          .then((userInfo) => {
            if (!userInfo) return
            setUser(userInfo)
            localStorage.setItem('user', JSON.stringify(userInfo))
          })
          .catch(() => setUser(null))
      } else {
        const authPortalUrl = 'https://www.arcgis.com'
        const clientId = import.meta.env.VITE_CLIENT_ID
        const info = new OAuthInfo({
          appId: clientId,
          portalUrl: authPortalUrl,
          popup: false
        })
        IdentityManager.registerOAuthInfos([info])
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
    const authPortalUrl = hasLocalPortalCredentials ? portalUrl : 'https://www.arcgis.com'
    const authPromise = hasLocalPortalCredentials
      ? signInToLocalPortal()
      : IdentityManager.getCredential(`${authPortalUrl}/sharing`)
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
