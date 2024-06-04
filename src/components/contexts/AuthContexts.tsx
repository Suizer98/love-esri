import IdentityManager from '@arcgis/core/identity/IdentityManager'
import OAuthInfo from '@arcgis/core/identity/OAuthInfo'
import Portal from '@arcgis/core/portal/Portal'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextProps {
  user: any
  signIn: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  signIn: () => {},
  signOut: () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const clientId = import.meta.env.VITE_CLIENT_ID // Use VITE_ prefix

    const info = new OAuthInfo({
      appId: clientId,
      portalUrl: 'https://www.arcgis.com',
      popup: false
    })

    IdentityManager.registerOAuthInfos([info])

    IdentityManager.checkSignInStatus(`${info.portalUrl}/sharing`)
      .then(() => {
        const portal = new Portal()
        portal.load().then(() => {
          setUser(portal.user)
        })
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  const signIn = () => {
    IdentityManager.getCredential(`https://www.arcgis.com/sharing`)
      .then(() => {
        const portal = new Portal()
        portal.load().then(() => {
          setUser(portal.user)
        })
      })
      .catch(() => {
        setUser(null)
      })
  }

  const signOut = () => {
    IdentityManager.destroyCredentials()
    setUser(null)
    window.location.reload()
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}
