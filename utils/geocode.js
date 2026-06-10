const fetch = require('node-fetch')

async function reverseGeocode(lat, lng) {
  if (!lat || !lng) return null
  if (process.env.GEOCODE_PROVIDER === 'google' && process.env.GOOGLE_GEOCODE_API_KEY) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_GEOCODE_API_KEY}`
    const result = await fetch(url).then((res) => res.json())
    const data = result.results && result.results[0]
    if (!data) return null
    const address = data.formatted_address
    const addressComponents = data.address_components || []
    return {
      fullAddress: address,
      city: getComponent(addressComponents, 'locality') || getComponent(addressComponents, 'postal_town') || getComponent(addressComponents, 'administrative_area_level_2') || '',
      state: getComponent(addressComponents, 'administrative_area_level_1') || '',
      country: getComponent(addressComponents, 'country') || '',
      mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
    }
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
  const result = await fetch(url, { headers: { 'User-Agent': 'AccidentGuardian/1.0' } }).then((res) => res.json())
  if (!result) return null
  const addr = result.address || {}
  return {
    fullAddress: result.display_name || `${lat}, ${lng}`,
    city: addr.city || addr.town || addr.village || addr.county || '',
    state: addr.state || addr.region || '',
    country: addr.country || '',
    mapsUrl: `https://maps.google.com/?q=${lat},${lng}`
  }
}

function getComponent(components, type) {
  const item = components.find((c) => c.types && c.types.includes(type))
  return item ? item.long_name : ''
}

module.exports = { reverseGeocode }
