import { useState } from 'react';
import { usePlaceData } from '../hooks/usePlaceData';

export default function PlaceModal({ place, onClose, onSave, isSaved = false }) {
  const { wikiData, imageData, isLoading } = usePlaceData(place);
  const [userImagePreview, setUserImagePreview] = useState(null);

  if (!place) return null;

  // Determine which image to show - user upload takes priority
  const displayImage = userImagePreview || place.userImageUrl || imageData?.url;

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSave() {
    // User uploaded image overrides everything
    const finalUserImage = userImagePreview || null;

    onSave({
      ...place,
      wikiSummary: wikiData?.summary || null,
      wikiUrl: wikiData?.pageUrl || null,
      autoImageUrl: finalUserImage ? null : imageData?.url || null, // Clear auto if user uploaded
      userImageUrl: finalUserImage,
    });
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
          {isLoading && !displayImage ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : displayImage ? (
            <img
              src={displayImage}
              alt={place.shortName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-blue-400">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">No image available</span>
              </div>
            </div>
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

          {/* Image source indicator */}
          {userImagePreview && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-green-600/80 px-2 py-1 rounded">
              Your Photo
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

          {/* Upload personal photo - always shows for new places */}
          {!isSaved && (
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
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
                      <span className="block text-xs text-gray-400 mt-1">Your photo will replace the default image</span>
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
