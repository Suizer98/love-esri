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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    const clientId = import.meta.env.VITE_CLIENT_ID

    const info = new OAuthInfo({
      appId: clientId,
      portalUrl: 'https://www.arcgis.com',
      popup: false
    })

    IdentityManager.registerOAuthInfos([info])

    if (!user) {
      IdentityManager.checkSignInStatus(`${info.portalUrl}/sharing`)
        .then(() => {
          const portal = new Portal()
          portal.load().then(() => {
            const user = portal.user
            const userInfo = {
              username: user.username,
              fullName: user.fullName,
              email: user.email,
              role: user.role
              // Add any other properties you need
            }
            setUser(userInfo)
            localStorage.setItem('user', JSON.stringify(userInfo))
          })
        })
        .catch(() => {
          setUser(null)
        })
    }
  }, [user])

  const signIn = () => {
    IdentityManager.getCredential(`https://www.arcgis.com/sharing`)
      .then(() => {
        const portal = new Portal()
        portal.load().then(() => {
          const user = portal.user
          const userInfo = {
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role
            // Add any other properties you need
          }
          setUser(userInfo)
          localStorage.setItem('user', JSON.stringify(userInfo))
        })
      })
      .catch(() => {
        setUser(null)
      })
  }

  const signOut = () => {
    IdentityManager.destroyCredentials()
    setUser(null)
    localStorage.removeItem('user')
    window.location.reload()
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}
