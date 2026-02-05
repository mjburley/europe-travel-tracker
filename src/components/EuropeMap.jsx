import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom green icon for visited places
const visitedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom red icon for temporary/search markers
const tempIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Europe center coordinates
const EUROPE_CENTER = [54.526, 15.2551];
const EUROPE_ZOOM = 4;

// Component to handle fly-to animations
function FlyToLocation({ position, zoom = 10 }) {
  const map = useMap();
  const prevPosition = useRef(null);

  useEffect(() => {
    if (position && (
      !prevPosition.current ||
      prevPosition.current[0] !== position[0] ||
      prevPosition.current[1] !== position[1]
    )) {
      map.flyTo(position, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
      prevPosition.current = position;
    }
  }, [position, zoom, map]);

  return null;
}

export default function EuropeMap({
  selectedPlace,
  visitedPlaces = [],
  onMarkerClick,
  onSavePlace
}) {
  return (
    <MapContainer
      center={EUROPE_CENTER}
      zoom={EUROPE_ZOOM}
      className="w-full h-full"
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Fly to selected place */}
      {selectedPlace && (
        <FlyToLocation position={[selectedPlace.lat, selectedPlace.lon]} />
      )}

      {/* Temporary marker for search result */}
      {selectedPlace && (
        <Marker
          position={[selectedPlace.lat, selectedPlace.lon]}
          icon={tempIcon}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-900">{selectedPlace.shortName}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedPlace.country}</p>
              {onSavePlace && (
                <button
                  onClick={() => onSavePlace(selectedPlace)}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  + Add to Visited Places
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Visited places markers */}
      {visitedPlaces.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lon]}
          icon={visitedIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(place),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-900">{place.shortName}</h3>
              <p className="text-sm text-gray-600">{place.country}</p>
              {place.wikiSummary && (
                <p className="text-sm text-gray-700 mt-2">{place.wikiSummary}</p>
              )}
              {place.autoImageUrl && (
                <img
                  src={place.autoImageUrl}
                  alt={place.shortName}
                  className="w-full h-24 object-cover rounded mt-2"
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export { visitedIcon, tempIcon };
