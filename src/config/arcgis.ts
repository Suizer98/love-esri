import esriConfig from '@arcgis/core/config'

// Point the ArcGIS JS API at a specific portal (e.g. local Docker Enterprise).
// When set, itemId on arcgis-map and other portal item lookups use this URL.
// Leave unset to use ArcGIS Online (https://www.arcgis.com).
// For Docker ArcGIS Enterprise use e.g. https://localhost:7443/arcgis

// Effective portal URL for item lookups and auth. Export for use in auth store/context.
export const portalUrl =
  import.meta.env.VITE_ARCGIS_PORTAL_URL || 'https://www.arcgis.com'

// True when using a custom portal (e.g. local Docker Enterprise) instead of arcgis.com
export const isLocalPortal = !!import.meta.env.VITE_ARCGIS_PORTAL_URL

// Only use local portal login when portal URL + user + password are all set in .env
export const hasLocalPortalCredentials =
  isLocalPortal &&
  !!import.meta.env.VITE_ARCGIS_PORTAL_USER &&
  !!import.meta.env.VITE_ARCGIS_PORTAL_PASSWORD

if (import.meta.env.VITE_ARCGIS_PORTAL_URL) {
  esriConfig.portalUrl = portalUrl
}
