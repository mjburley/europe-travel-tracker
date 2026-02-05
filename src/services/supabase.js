import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const SUPABASE_URL = 'https://vmvhzcodrtlklmsekpyf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__v2A2o7kixvHCEg6qE43IA_pMriE7F6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Table: visited_places
// Schema:
// - id: uuid (primary key, auto-generated)
// - place_id: text (from Nominatim)
// - name: text
// - short_name: text
// - lat: float8
// - lon: float8
// - country: text
// - wiki_url: text (nullable)
// - auto_image_url: text (nullable)
// - user_image_url: text (nullable)
// - notes: text (nullable)
// - category: text ('visited' or 'want_to_visit')
// - want_to_visit_reason: text (nullable)
// - visited_at: timestamptz
// - created_at: timestamptz (auto)

export async function getVisitedPlaces() {
  const { data, error } = await supabase
    .from('visited_places')
    .select('*')
    .order('visited_at', { ascending: false });

  if (error) {
    console.error('Error fetching places:', error);
    return [];
  }

  return data.map(transformFromDb);
}

export async function saveVisitedPlace(place) {
  const dbPlace = transformToDb(place);

  const { data, error } = await supabase
    .from('visited_places')
    .insert([dbPlace])
    .select()
    .single();

  if (error) {
    console.error('Error saving place:', error);
    throw error;
  }

  return transformFromDb(data);
}

export async function deleteVisitedPlace(id) {
  const { error } = await supabase
    .from('visited_places')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
}

export async function uploadUserImage(file, placeId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${placeId}-${Date.now()}.${fileExt}`;
  const filePath = `user-photos/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('travel-photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('travel-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Transform from DB format to app format
function transformFromDb(dbPlace) {
  return {
    id: dbPlace.id,
    placeId: dbPlace.place_id,
    name: dbPlace.name,
    shortName: dbPlace.short_name,
    lat: dbPlace.lat,
    lon: dbPlace.lon,
    country: dbPlace.country,
    wikiUrl: dbPlace.wiki_url,
    autoImageUrl: dbPlace.auto_image_url,
    userImageUrl: dbPlace.user_image_url,
    notes: dbPlace.notes,
    category: dbPlace.category || 'visited',
    wantToVisitReason: dbPlace.want_to_visit_reason,
    visitedAt: dbPlace.visited_at,
  };
}

// Transform from app format to DB format
function transformToDb(place) {
  return {
    place_id: String(place.id),
    name: place.name,
    short_name: place.shortName,
    lat: place.lat,
    lon: place.lon,
    country: place.country,
    wiki_url: place.wikiUrl || null,
    auto_image_url: place.autoImageUrl || null,
    user_image_url: place.userImageUrl || null,
    notes: place.notes || null,
    category: place.category || 'visited',
    want_to_visit_reason: place.wantToVisitReason || null,
    visited_at: place.visitedAt || new Date().toISOString(),
  };
}
