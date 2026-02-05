import { useState, useEffect } from 'react';
import { getRecommendation } from '../services/recommendations';
import { getPlaceImage } from '../services/unsplash';

export default function RecommendationModal({ places, onClose, onAddToWishlist }) {
  const [recommendation, setRecommendation] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendation() {
      setIsLoading(true);
      const rec = getRecommendation(places);
      setRecommendation(rec);

      // Fetch an image
      const image = await getPlaceImage(rec.name, rec.country);
      setImageUrl(image?.url);
      setIsLoading(false);
    }
    loadRecommendation();
  }, [places]);

  function handleAddToWishlist() {
    if (!recommendation) return;

    onAddToWishlist({
      id: `rec-${Date.now()}`,
      name: recommendation.name,
      shortName: recommendation.name,
      lat: recommendation.lat,
      lon: recommendation.lon,
      country: recommendation.country,
      wantToVisitReason: recommendation.reason,
    });
  }

  function handleGetAnother() {
    setIsLoading(true);
    const rec = getRecommendation(places);
    setRecommendation(rec);

    getPlaceImage(rec.name, rec.country).then(image => {
      setImageUrl(image?.url);
      setIsLoading(false);
    });
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-indigo-500">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={recommendation?.name}
              className="w-full h-full object-cover"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-white/20 backdrop-blur rounded-full">
            <span className="text-white text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Recommended
            </span>
          </div>

          {/* Title overlay */}
          {recommendation && (
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white">{recommendation.name}</h2>
              <p className="text-white/80">{recommendation.country}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          ) : recommendation ? (
            <>
              <p className="text-gray-700 leading-relaxed mb-2">
                {recommendation.description}
              </p>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <span className="font-medium">Why we think you'll love it:</span>{' '}
                  {recommendation.reason}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={handleGetAnother}
            disabled={isLoading}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Show Another
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            Add to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
