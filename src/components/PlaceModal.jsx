import { useState } from 'react';
import { usePlaceData } from '../hooks/usePlaceData';

export default function PlaceModal({ place, onClose, onSave, isSaved = false }) {
  const { wikiData, imageData, isLoading } = usePlaceData(place);
  const [userImage, setUserImage] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);

  if (!place) return null;

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSave() {
    onSave({
      ...place,
      wikiSummary: wikiData?.summary || null,
      wikiUrl: wikiData?.pageUrl || null,
      autoImageUrl: imageData?.url || null,
      userImageUrl: userImagePreview || null,
    });
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-48 bg-gray-200">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <img
              src={userImagePreview || imageData?.url}
              alt={place.shortName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image credit */}
          {imageData?.photographer && (
            <div className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">
              Photo: {imageData.photographer}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{place.shortName}</h2>
          <p className="text-gray-500 mb-4">{place.country}</p>

          {/* Wikipedia Summary */}
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          ) : wikiData?.summary ? (
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{wikiData.summary}</p>
              {wikiData.pageUrl && (
                <a
                  href={wikiData.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Read more on Wikipedia
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">No Wikipedia info available</p>
          )}

          {/* Upload personal photo */}
          {!isSaved && (
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <label className="block cursor-pointer text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-gray-600">
                  {userImagePreview ? (
                    <span className="text-green-600 font-medium">Photo uploaded! Click to change</span>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Click to upload your travel photo</span>
                    </>
                  )}
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {isSaved ? (
            <div className="text-center text-green-600 font-medium">
              Already in your visited places
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save to Visited Places
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
