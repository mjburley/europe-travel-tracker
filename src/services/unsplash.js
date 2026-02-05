// Note: For production, you should use your own Unsplash API key
// Get one free at: https://unsplash.com/developers
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

// Fallback to Pexels-like free image search if no API key
const USE_UNSPLASH_SOURCE = true; // Uses unsplash source (no API key needed, but limited)

export async function getPlaceImage(placeName, country = '') {
  const searchQuery = `${placeName} ${country} city landscape`;

  // Option 1: Use Unsplash Source (no API key required, but random results)
  if (USE_UNSPLASH_SOURCE || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
    // This returns a random image matching the query
    // Size: 800x600 for good quality without being too large
    const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(searchQuery)}`;

    return {
      url: imageUrl,
      photographer: 'Unsplash',
      photographerUrl: 'https://unsplash.com',
      source: 'unsplash-source',
    };
  }

  // Option 2: Use Unsplash API (requires API key, better results)
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Unsplash API error');
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      return {
        url: photo.urls.regular,
        thumbnail: photo.urls.small,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        downloadUrl: photo.links.download,
        source: 'unsplash-api',
      };
    }
  } catch (error) {
    console.error('Unsplash API error:', error);
  }

  // Fallback: return a placeholder
  return {
    url: `https://source.unsplash.com/800x600/?${encodeURIComponent(placeName + ' europe')}`,
    photographer: 'Unsplash',
    photographerUrl: 'https://unsplash.com',
    source: 'unsplash-fallback',
  };
}
