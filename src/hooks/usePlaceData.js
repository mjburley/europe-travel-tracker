import { useState, useEffect } from 'react';
import { getWikiSummary } from '../services/wikipedia';
import { getPlaceImage } from '../services/unsplash';

export function usePlaceData(place) {
  const [data, setData] = useState({
    wikiData: null,
    imageData: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!place) {
      setData({ wikiData: null, imageData: null, isLoading: false, error: null });
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setData((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Fetch Wikipedia and Unsplash data in parallel
        const [wikiData, imageData] = await Promise.all([
          getWikiSummary(place.shortName, place.country),
          getPlaceImage(place.shortName, place.country),
        ]);

        if (!cancelled) {
          setData({
            wikiData,
            imageData,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setData({
            wikiData: null,
            imageData: null,
            isLoading: false,
            error: error.message,
          });
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [place?.id, place?.shortName, place?.country]);

  return data;
}
