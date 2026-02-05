import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
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
  tooltipAnchor: [12, -20],
  shadowSize: [41, 41],
});

// Custom red icon for temporary/search markers
const tempIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [12, -20],
  shadowSize: [41, 41],
});

// Europe center coordinates and bounds
const EUROPE_CENTER = [54.526, 15.2551];
const EUROPE_ZOOM = 4;
const EUROPE_BOUNDS = {
  minLat: 34.0,
  maxLat: 72.0,
  minLon: -25.0,
  maxLon: 45.0,
};

// Check if coordinates are within Europe
function isInEurope(lat, lon) {
  return (
    lat >= EUROPE_BOUNDS.minLat &&
    lat <= EUROPE_BOUNDS.maxLat &&
    lon >= EUROPE_BOUNDS.minLon &&
    lon <= EUROPE_BOUNDS.maxLon
  );
}

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

// Component to handle map click events
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      if (isInEurope(lat, lng)) {
        onMapClick(lat, lng);
      }
    },
  });
  return null;
}

export default function EuropeMap({
  selectedPlace,
  visitedPlaces = [],
  onMarkerClick,
  onMapClick,
}) {
  return (
    <MapContainer
      center={EUROPE_CENTER}
      zoom={EUROPE_ZOOM}
      className="w-full h-full"
      scrollWheelZoom={true}
      wheelPxPerZoomLevel={300}
      zoomControl={false}
      maxBounds={[
        [EUROPE_BOUNDS.minLat - 5, EUROPE_BOUNDS.minLon - 10],
        [EUROPE_BOUNDS.maxLat + 5, EUROPE_BOUNDS.maxLon + 10],
      ]}
      minZoom={3}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Zoom controls in bottom-right to avoid title overlap */}
      <ZoomControl position="bottomright" />

      {/* Handle map clicks */}
      <MapClickHandler onMapClick={onMapClick} />

      {/* Fly to selected place */}
      {selectedPlace && (
        <FlyToLocation position={[selectedPlace.lat, selectedPlace.lon]} />
      )}

      {/* Temporary marker for search/click result */}
      {selectedPlace && (
        <Marker
          position={[selectedPlace.lat, selectedPlace.lon]}
          icon={tempIcon}
        >
          <Tooltip direction="top" offset={[0, -20]} permanent>
            <span className="font-medium">{selectedPlace.shortName}</span>
          </Tooltip>
        </Marker>
      )}

      {/* Visited places markers with hover tooltips */}
      {visitedPlaces.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lon]}
          icon={visitedIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(place),
          }}
        >
          <Tooltip
            direction="top"
            offset={[0, -20]}
            className="visited-tooltip"
          >
            <div className="text-center min-w-[120px]">
              {(place.userImageUrl || place.autoImageUrl) && (
                <img
                  src={place.userImageUrl || place.autoImageUrl}
                  alt={place.shortName}
                  className="w-full h-16 object-cover rounded mb-1"
                />
              )}
              <div className="font-medium text-gray-900">{place.shortName}</div>
              <div className="text-xs text-gray-500">{place.country}</div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}

export { visitedIcon, tempIcon, isInEurope };
