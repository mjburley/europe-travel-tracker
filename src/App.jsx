import { useState, useEffect } from 'react';
import EuropeMap from './components/EuropeMap';
import SearchBar from './components/SearchBar';
import PlaceModal from './components/PlaceModal';
import VisitedPlacesList from './components/VisitedPlacesList';
import { reverseGeocode } from './services/nominatim';
import './index.css';

// Local storage key for persistence
const STORAGE_KEY = 'europe-travel-tracker-places';

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalPlace, setModalPlace] = useState(null);
  const [visitedPlaces, setVisitedPlaces] = useState([]);

  // Load visited places from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setVisitedPlaces(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved places:', error);
    }
  }, []);

  // Save to localStorage when visitedPlaces changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedPlaces));
    } catch (error) {
      console.error('Error saving places:', error);
    }
  }, [visitedPlaces]);

  function handlePlaceSelect(place) {
    setSelectedPlace(place);
    setModalPlace(place);
  }

  async function handleMapClick(lat, lon) {
    // Reverse geocode to get place name
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

  function handleSavePlace(placeWithData) {
    // Check if already visited (by coordinates, since clicked places have unique IDs)
    const isDuplicate = visitedPlaces.some(
      (p) => Math.abs(p.lat - placeWithData.lat) < 0.001 && Math.abs(p.lon - placeWithData.lon) < 0.001
    );

    if (isDuplicate) {
      return;
    }

    const newVisitedPlace = {
      ...placeWithData,
      visitedAt: new Date().toISOString(),
    };

    setVisitedPlaces((prev) => [...prev, newVisitedPlace]);
    setSelectedPlace(null);
    setModalPlace(null);
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
    // Check by coordinates for clicked places
    return visitedPlaces.some(
      (p) => Math.abs(p.lat - place.lat) < 0.001 && Math.abs(p.lon - place.lon) < 0.001
    );
  }

  function handleDeletePlace(placeId) {
    setVisitedPlaces((prev) => prev.filter((p) => p.id !== placeId));
  }

  function handleFlyToPlace(place) {
    setSelectedPlace(place);
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Map takes full screen */}
      <EuropeMap
        selectedPlace={selectedPlace}
        visitedPlaces={visitedPlaces}
        onMarkerClick={handleMarkerClick}
        onMapClick={handleMapClick}
      />

      {/* Search bar overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full px-4 flex justify-center">
        <SearchBar onPlaceSelect={handlePlaceSelect} />
      </div>

      {/* Visited places counter */}
      {visitedPlaces.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <span className="font-medium text-gray-700">
            {visitedPlaces.length} place{visitedPlaces.length !== 1 ? 's' : ''} visited
          </span>
        </div>
      )}

      {/* App title */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <h1 className="text-lg font-bold text-gray-800">Europe Travel Tracker</h1>
      </div>

      {/* Visited Places Sidebar */}
      <VisitedPlacesList
        places={visitedPlaces}
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
        />
      )}
    </div>
  );
}

export default App;
