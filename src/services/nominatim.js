const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Europe bounding box (approximate)
const EUROPE_BOUNDS = {
  minLat: 34.0,
  maxLat: 72.0,
  minLon: -25.0,
  maxLon: 45.0,
};

export async function searchPlaces(query) {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '10',
    viewbox: `${EUROPE_BOUNDS.minLon},${EUROPE_BOUNDS.maxLat},${EUROPE_BOUNDS.maxLon},${EUROPE_BOUNDS.minLat}`,
    bounded: '1',
  });

  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();

    return data
      .filter((place) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        return (
          lat >= EUROPE_BOUNDS.minLat &&
          lat <= EUROPE_BOUNDS.maxLat &&
          lon >= EUROPE_BOUNDS.minLon &&
          lon <= EUROPE_BOUNDS.maxLon
        );
      })
      .map((place) => ({
        id: place.place_id,
        name: place.display_name,
        shortName: place.name || place.display_name.split(',')[0],
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        country: place.address?.country || '',
        type: place.type,
        addressType: place.addresstype,
      }));
  } catch (error) {
    console.error('Nominatim search error:', error);
    return [];
  }
}

export async function reverseGeocode(lat, lon) {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: 'json',
    addressdetails: '1',
  });

  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
      headers: {
        'Accept-Language': 'en',
      },
    });

    if (!response.ok) throw new Error('Reverse geocode failed');

    const data = await response.json();

    return {
      name: data.display_name,
      shortName: data.name || data.address?.city || data.address?.town || data.address?.village || 'Unknown',
      country: data.address?.country || '',
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
}
