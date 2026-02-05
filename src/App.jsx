import { useState, useEffect } from 'react';
import EuropeMap from './components/EuropeMap';
import SearchBar from './components/SearchBar';
import PlaceModal from './components/PlaceModal';
import PlacesList from './components/PlacesList';
import RecommendationModal from './components/RecommendationModal';
import { reverseGeocode } from './services/nominatim';
import { getVisitedPlaces, saveVisitedPlace, deleteVisitedPlace } from './services/supabase';
import './index.css';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalPlace, setModalPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Load places from Supabase on mount
  useEffect(() => {
    async function loadPlaces() {
      try {
        setIsLoading(true);
        const loadedPlaces = await getVisitedPlaces();
        setPlaces(loadedPlaces);
        setError(null);
      } catch (err) {
        console.error('Error loading places:', err);
        setError('Failed to load places');
      } finally {
        setIsLoading(false);
      }
    }
    loadPlaces();
  }, []);

  function handlePlaceSelect(place) {
    setSelectedPlace(place);
    setModalPlace(place);
  }

  async function handleMapClick(lat, lon) {
    const locationInfo = await reverseGeocode(lat, lon);

    const clickedPlace = {
      id: `clicked-${Date.now()}`,
      name: locationInfo?.name || 'Unknown Location',
      shortName: locationInfo?.shortName || 'Unknown',
      lat,
      lon,
      country: locationInfo?.country || '',
    };

    setSelectedPlace(clickedPlace);
    setModalPlace(clickedPlace);
  }

  async function handleSavePlace(placeWithData) {
    // Check if already saved (by coordinates)
    const isDuplicate = places.some(
      (p) => Math.abs(p.lat - placeWithData.lat) < 0.001 && Math.abs(p.lon - placeWithData.lon) < 0.001
    );

    if (isDuplicate) {
      return;
    }

    try {
      const savedPlace = await saveVisitedPlace({
        ...placeWithData,
        visitedAt: new Date().toISOString(),
      });

      setPlaces((prev) => [savedPlace, ...prev]);
      setSelectedPlace(null);
      setModalPlace(null);
      setShowRecommendation(false);
    } catch (err) {
      console.error('Error saving place:', err);
      setError('Failed to save place');
    }
  }

  async function handleAddRecommendationToWishlist(recPlace) {
    try {
      const savedPlace = await saveVisitedPlace({
        ...recPlace,
        category: 'want_to_visit',
        visitedAt: new Date().toISOString(),
      });

      setPlaces((prev) => [savedPlace, ...prev]);
      setShowRecommendation(false);
      setSelectedPlace(savedPlace);
    } catch (err) {
      console.error('Error saving recommendation:', err);
      setError('Failed to save place');
    }
  }

  function handleMarkerClick(place) {
    setModalPlace(place);
  }

  function handleCloseModal() {
    setModalPlace(null);
    setSelectedPlace(null);
  }

  function isPlaceSaved(place) {
    if (!place) return false;
    return places.some(
      (p) => Math.abs(p.lat - place.lat) < 0.001 && Math.abs(p.lon - place.lon) < 0.001
    );
  }

  async function handleDeletePlace(placeId) {
    try {
      await deleteVisitedPlace(placeId);
      setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    } catch (err) {
      console.error('Error deleting place:', err);
      setError('Failed to delete place');
    }
  }

  function handleFlyToPlace(place) {
    setSelectedPlace(place);
  }

  // Count by category
  const visitedCount = places.filter(p => p.category !== 'want_to_visit').length;
  const wishlistCount = places.filter(p => p.category === 'want_to_visit').length;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Map takes full screen */}
      <EuropeMap
        selectedPlace={selectedPlace}
        places={places}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />

      {/* Search bar overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full px-4 flex justify-center">
        <SearchBar onPlaceSelect={handlePlaceSelect} />
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <span className="text-gray-600">Loading places...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-lg">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">x</button>
        </div>
      )}

      {/* Places counter */}
      {places.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <div className="flex gap-3 text-sm">
            {visitedCount > 0 && (
              <span className="text-green-600 font-medium">
                {visitedCount} visited
              </span>
            )}
            {wishlistCount > 0 && (
              <span className="text-amber-600 font-medium">
                {wishlistCount} wishlist
              </span>
            )}
          </div>
        </div>
      )}

      {/* App title */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <h1 className="text-lg font-bold text-gray-800">Europe Travel Tracker</h1>
      </div>

      {/* Recommend button */}
      <button
        onClick={() => setShowRecommendation(true)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2.5 rounded-full shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center gap-2 font-medium"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Recommend a Place
      </button>

      {/* Places Sidebar */}
      <PlacesList
        places={places}
        onPlaceClick={handleFlyToPlace}
        onDeletePlace={handleDeletePlace}
      />

      {/* Place Modal */}
      {modalPlace && (
        <PlaceModal
          place={modalPlace}
          onClose={handleCloseModal}
          onSave={handleSavePlace}
          isSaved={isPlaceSaved(modalPlace)}
          existingCategory={modalPlace.category}
        />
      )}

      {/* Recommendation Modal */}
      {showRecommendation && (
        <RecommendationModal
          places={places}
          onClose={() => setShowRecommendation(false)}
          onAddToWishlist={handleAddRecommendationToWishlist}
        />
      )}
    </div>
  );
}

export default App;
