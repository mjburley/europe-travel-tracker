import { useState } from 'react';

export default function PlacesList({ places, onPlaceClick, onDeletePlace }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('visited');

  const visitedPlaces = places.filter(p => p.category !== 'want_to_visit');
  const wishlistPlaces = places.filter(p => p.category === 'want_to_visit');

  const displayPlaces = activeTab === 'visited' ? visitedPlaces : wishlistPlaces;

  if (places.length === 0) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span className="font-medium text-gray-700">My Places</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[1500] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">My Places</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('visited')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'visited'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Visited ({visitedPlaces.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'wishlist'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Wishlist ({wishlistPlaces.length})
          </button>
        </div>

        {/* Places List */}
        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {displayPlaces.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">
                {activeTab === 'visited'
                  ? 'No visited places yet'
                  : 'No places on your wishlist'}
              </p>
            </div>
          ) : (
            displayPlaces.map((place) => (
              <div
                key={place.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden ${
                    place.userImageUrl || place.autoImageUrl ? 'bg-gray-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                  }`}>
                    {(place.userImageUrl || place.autoImageUrl) ? (
                      <img
                        src={place.userImageUrl || place.autoImageUrl}
                        alt={place.shortName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{place.shortName}</h3>
                    <p className="text-xs text-gray-500 truncate">{place.country}</p>
                    {place.notes && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{place.notes}</p>
                    )}
                    {place.wantToVisitReason && (
                      <p className="text-xs text-amber-600 mt-1 line-clamp-2">{place.wantToVisitReason}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {
                        onPlaceClick(place);
                        setIsOpen(false);
                      }}
                      className="p-1.5 rounded hover:bg-blue-100 text-blue-600"
                      title="View on map"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeletePlace(place.id)}
                      className="p-1.5 rounded hover:bg-red-100 text-red-600"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[1400]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
