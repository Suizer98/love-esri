import IdentityManager from '@arcgis/core/identity/IdentityManager'
import Portal from '@arcgis/core/portal/Portal'
import { portalUrl } from '../config/arcgis'

// Get a token from local portal generateToken and register it with IdentityManager.
// Use when VITE_ARCGIS_PORTAL_URL is set (e.g. Docker Enterprise) with username/password auth.
export async function signInToLocalPortal(): Promise<void> {
  const sharingUrl = `${portalUrl}/sharing/rest/generateToken`
  const username = import.meta.env.VITE_ARCGIS_PORTAL_USER as string
  const password = import.meta.env.VITE_ARCGIS_PORTAL_PASSWORD as string
  const body = new URLSearchParams({
    username,
    password,
    client: 'referer',
    referer: typeof window !== 'undefined' ? window.location.origin : '',
    expiration: '60',
    f: 'json'
  })
  const res = await fetch(sharingUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })
  if (!res.ok) throw new Error(`Token request failed: ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || 'Generate token failed')
  if (!data.token) throw new Error('No token in response')
  IdentityManager.registerToken({
    server: `${portalUrl}/sharing`,
    token: data.token
  })
}

// Load portal and return user info, or null if not signed in. Pass url for a specific portal (default: config portalUrl).
export async function getPortalUser(url?: string): Promise<{
  username: string
  fullName: string
  email: string
  role: string
} | null> {
  const baseUrl = url ?? portalUrl
  const portal = new Portal({ url: baseUrl })
  await portal.load()
  const u = portal.user
  if (!u) return null
  return {
    username: u.username,
    fullName: u.fullName ?? '',
    email: u.email ?? '',
    role: u.role ?? ''
  }
}
