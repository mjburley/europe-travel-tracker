const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1';

export async function getWikiSummary(placeName, country = '') {
  // Try different search terms to find the best match
  const searchTerms = [
    `${placeName}, ${country}`,
    placeName,
    `${placeName} (city)`,
  ];

  for (const term of searchTerms) {
    try {
      // First, search for the page
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&format=json&origin=*`;

      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) continue;

      const searchData = await searchResponse.json();
      if (!searchData.query?.search?.length) continue;

      const pageTitle = searchData.query.search[0].title;

      // Get the summary for this page
      const summaryUrl = `${WIKIPEDIA_API_URL}/page/summary/${encodeURIComponent(pageTitle)}`;

      const summaryResponse = await fetch(summaryUrl);
      if (!summaryResponse.ok) continue;

      const summaryData = await summaryResponse.json();

      if (summaryData.extract) {
        // Get first 2-3 sentences
        const sentences = summaryData.extract.match(/[^.!?]+[.!?]+/g) || [];
        const shortSummary = sentences.slice(0, 2).join(' ').trim();

        return {
          summary: shortSummary || summaryData.extract.slice(0, 300) + '...',
          fullSummary: summaryData.extract,
          pageUrl: summaryData.content_urls?.desktop?.page || null,
          title: summaryData.title,
        };
      }
    } catch (error) {
      console.error(`Wikipedia search error for "${term}":`, error);
      continue;
    }
  }

  return null;
}
