import { useState, useEffect } from 'react';
import EuropeMap from './components/EuropeMap';
import SearchBar from './components/SearchBar';
import PlaceModal from './components/PlaceModal';
import VisitedPlacesList from './components/VisitedPlacesList';
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

  function handleSavePlace(placeWithData) {
    // Check if already visited
    if (visitedPlaces.some((p) => p.id === placeWithData.id)) {
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
    return visitedPlaces.some((p) => p.id === place?.id);
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
        onSavePlace={(place) => {
          setModalPlace(place);
        }}
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
