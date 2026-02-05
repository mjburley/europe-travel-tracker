import { useState } from 'react';
import { usePlaceData } from '../hooks/usePlaceData';

export default function PlaceModal({ place, onClose, onSave, isSaved = false, existingCategory = null }) {
  const { wikiData, imageData, isLoading } = usePlaceData(place);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [notes, setNotes] = useState(place.notes || '');
  const [wantToVisitReason, setWantToVisitReason] = useState(place.wantToVisitReason || '');
  const [category, setCategory] = useState(existingCategory || 'visited');

  if (!place) return null;

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
    const finalUserImage = userImagePreview || null;

    onSave({
      ...place,
      wikiUrl: wikiData?.pageUrl || null,
      autoImageUrl: finalUserImage ? null : imageData?.url || null,
      userImageUrl: finalUserImage,
      notes: notes.trim() || null,
      category,
      wantToVisitReason: category === 'want_to_visit' ? wantToVisitReason.trim() || null : null,
    });
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-40 bg-gradient-to-br from-blue-100 to-blue-200">
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
                <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {userImagePreview && (
            <div className="absolute bottom-2 right-2 text-xs text-white bg-green-600/80 px-2 py-1 rounded">
              Your Photo
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{place.shortName}</h2>
              <p className="text-gray-500 text-sm">{place.country}</p>
            </div>
            {wikiData?.pageUrl && (
              <a
                href={wikiData.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Wikipedia
              </a>
            )}
          </div>

          {!isSaved && (
            <>
              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory('visited')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      category === 'visited'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    I've Visited
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('want_to_visit')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      category === 'want_to_visit'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Want to Visit
                  </button>
                </div>
              </div>

              {/* Want to Visit Reason */}
              {category === 'want_to_visit' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to visit?</label>
                  <textarea
                    value={wantToVisitReason}
                    onChange={(e) => setWantToVisitReason(e.target.value)}
                    placeholder="What attracts you to this place..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
              )}

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {category === 'visited' ? 'Your notes & memories' : 'Notes'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={category === 'visited' ? 'What did you do? Favorite spots, memories...' : 'Any notes about this place...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Upload photo */}
              <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                <label className="block cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-gray-600 text-sm">
                    {userImagePreview ? (
                      <span className="text-green-600 font-medium">Photo uploaded! Click to change</span>
                    ) : (
                      <span>Click to upload a photo</span>
                    )}
                  </div>
                </label>
              </div>
            </>
          )}

          {/* Show saved place details */}
          {isSaved && (
            <div className="space-y-3">
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                place.category === 'want_to_visit'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {place.category === 'want_to_visit' ? 'Want to Visit' : 'Visited'}
              </div>

              {place.wantToVisitReason && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Why visit:</p>
                  <p className="text-sm text-gray-700">{place.wantToVisitReason}</p>
                </div>
              )}

              {place.notes && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Notes:</p>
                  <p className="text-sm text-gray-700">{place.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {isSaved ? (
            <div className="text-center text-gray-500 text-sm">
              Saved to your places
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`w-full py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                category === 'want_to_visit'
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {category === 'want_to_visit' ? 'Add to Wishlist' : 'Save as Visited'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
