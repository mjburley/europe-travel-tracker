// Curated European destinations with tags for matching
const EUROPEAN_DESTINATIONS = [
  // Coastal & Beach
  { name: 'Dubrovnik', country: 'Croatia', lat: 42.6507, lon: 18.0944, tags: ['coastal', 'historic', 'mediterranean', 'walled-city'], description: 'Stunning walled city on the Adriatic coast' },
  { name: 'Amalfi', country: 'Italy', lat: 40.6340, lon: 14.6027, tags: ['coastal', 'scenic', 'mediterranean', 'cliffs'], description: 'Dramatic cliffside town on the Italian coast' },
  { name: 'Santorini', country: 'Greece', lat: 36.3932, lon: 25.4615, tags: ['island', 'scenic', 'mediterranean', 'romantic'], description: 'Iconic white-washed buildings and stunning sunsets' },
  { name: 'Nice', country: 'France', lat: 43.7102, lon: 7.2620, tags: ['coastal', 'riviera', 'mediterranean', 'art'], description: 'Elegant French Riviera city with beautiful beaches' },
  { name: 'Lagos', country: 'Portugal', lat: 37.1028, lon: -8.6732, tags: ['coastal', 'beaches', 'atlantic', 'cliffs'], description: 'Dramatic cliffs and hidden beaches in the Algarve' },
  { name: 'Split', country: 'Croatia', lat: 43.5081, lon: 16.4402, tags: ['coastal', 'historic', 'roman', 'mediterranean'], description: 'Ancient Roman palace meets vibrant coastal city' },

  // Historic & Cultural
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lon: 14.4378, tags: ['historic', 'architecture', 'castle', 'gothic'], description: 'Fairy-tale architecture and rich history' },
  { name: 'Bruges', country: 'Belgium', lat: 51.2093, lon: 3.2247, tags: ['historic', 'canals', 'medieval', 'chocolate'], description: 'Perfectly preserved medieval city with charming canals' },
  { name: 'Tallinn', country: 'Estonia', lat: 59.4370, lon: 24.7536, tags: ['historic', 'medieval', 'baltic', 'old-town'], description: 'Best-preserved medieval old town in Northern Europe' },
  { name: 'Krakow', country: 'Poland', lat: 50.0647, lon: 19.9450, tags: ['historic', 'culture', 'architecture', 'jewish-heritage'], description: 'Poland\'s cultural capital with stunning Main Square' },
  { name: 'Salzburg', country: 'Austria', lat: 47.8095, lon: 13.0550, tags: ['historic', 'music', 'mozart', 'baroque'], description: 'Baroque city of Mozart and The Sound of Music' },
  { name: 'Toledo', country: 'Spain', lat: 39.8628, lon: -4.0273, tags: ['historic', 'medieval', 'religious', 'hilltop'], description: 'Medieval city of three cultures on a hilltop' },
  { name: 'Ghent', country: 'Belgium', lat: 51.0543, lon: 3.7174, tags: ['historic', 'canals', 'medieval', 'art'], description: 'Hidden gem with stunning medieval architecture' },

  // Nature & Mountains
  { name: 'Interlaken', country: 'Switzerland', lat: 46.6863, lon: 7.8632, tags: ['mountains', 'alps', 'adventure', 'lakes'], description: 'Gateway to the Swiss Alps with stunning lake views' },
  { name: 'Hallstatt', country: 'Austria', lat: 47.5622, lon: 13.6493, tags: ['mountains', 'lake', 'scenic', 'village'], description: 'Fairy-tale village nestled between mountains and lake' },
  { name: 'Plitvice', country: 'Croatia', lat: 44.8654, lon: 15.5820, tags: ['nature', 'waterfalls', 'lakes', 'national-park'], description: 'Cascading lakes and waterfalls in pristine nature' },
  { name: 'Lauterbrunnen', country: 'Switzerland', lat: 46.5936, lon: 7.9086, tags: ['mountains', 'waterfalls', 'alps', 'valley'], description: 'Valley of 72 waterfalls surrounded by cliffs' },
  { name: 'Lake Bled', country: 'Slovenia', lat: 46.3625, lon: 14.0938, tags: ['lake', 'mountains', 'island', 'castle'], description: 'Emerald lake with a church-topped island' },
  { name: 'Trolltunga', country: 'Norway', lat: 60.1241, lon: 6.7400, tags: ['nature', 'hiking', 'fjords', 'dramatic'], description: 'Iconic cliff jutting over a Norwegian fjord' },
  { name: 'Scottish Highlands', country: 'Scotland', lat: 57.1219, lon: -4.7126, tags: ['nature', 'mountains', 'castles', 'whisky'], description: 'Rugged landscapes, lochs, and ancient castles' },

  // Cities & Urban
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lon: -9.1393, tags: ['city', 'hills', 'trams', 'coastal'], description: 'Hilly city with vintage trams and vibrant culture' },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lon: 12.5683, tags: ['city', 'design', 'nordic', 'cycling'], description: 'Stylish Nordic capital with world-class design' },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, tags: ['city', 'music', 'imperial', 'coffee'], description: 'Imperial grandeur, classical music, and café culture' },
  { name: 'Budapest', country: 'Hungary', lat: 47.4979, lon: 19.0402, tags: ['city', 'thermal-baths', 'architecture', 'nightlife'], description: 'Stunning architecture split by the Danube' },
  { name: 'Edinburgh', country: 'Scotland', lat: 55.9533, lon: -3.1883, tags: ['city', 'castle', 'historic', 'festivals'], description: 'Dramatic castle and rich literary heritage' },
  { name: 'Seville', country: 'Spain', lat: 37.3891, lon: -5.9845, tags: ['city', 'flamenco', 'moorish', 'tapas'], description: 'Passionate city of flamenco and stunning palaces' },

  // Hidden Gems
  { name: 'Colmar', country: 'France', lat: 48.0794, lon: 7.3558, tags: ['village', 'wine', 'fairy-tale', 'alsace'], description: 'Colorful half-timbered houses in wine country' },
  { name: 'Sintra', country: 'Portugal', lat: 38.7971, lon: -9.3904, tags: ['palaces', 'romantic', 'forests', 'fairy-tale'], description: 'Whimsical palaces hidden in misty forests' },
  { name: 'Cesky Krumlov', country: 'Czech Republic', lat: 48.8127, lon: 14.3175, tags: ['medieval', 'castle', 'river', 'bohemian'], description: 'Fairy-tale town with a stunning castle complex' },
  { name: 'Ronda', country: 'Spain', lat: 36.7462, lon: -5.1611, tags: ['dramatic', 'gorge', 'bridge', 'andalusia'], description: 'Dramatic cliffside town split by a deep gorge' },
  { name: 'Kotor', country: 'Montenegro', lat: 42.4247, lon: 18.7712, tags: ['fjord', 'medieval', 'mountains', 'coastal'], description: 'Medieval walled town in a stunning bay' },
  { name: 'Mostar', country: 'Bosnia', lat: 43.3438, lon: 17.8078, tags: ['bridge', 'ottoman', 'historic', 'river'], description: 'Famous bridge and Ottoman heritage' },
  { name: 'Cinque Terre', country: 'Italy', lat: 44.1461, lon: 9.6439, tags: ['coastal', 'colorful', 'hiking', 'villages'], description: 'Five colorful villages clinging to the Italian coast' },
  { name: 'Giethoorn', country: 'Netherlands', lat: 52.7399, lon: 6.0776, tags: ['village', 'canals', 'peaceful', 'boats'], description: 'Car-free village with canals instead of roads' },
];

// Extract features from saved places
function analyzeSavedPlaces(places) {
  const features = {
    countries: new Set(),
    hasCoastal: false,
    hasHistoric: false,
    hasMountains: false,
    hasNature: false,
    hasCities: false,
    keywords: [],
  };

  const coastalTerms = ['beach', 'coast', 'sea', 'ocean', 'mediterranean', 'island', 'port'];
  const historicTerms = ['castle', 'medieval', 'old town', 'historic', 'ancient', 'roman', 'church', 'cathedral'];
  const mountainTerms = ['mountain', 'alps', 'hiking', 'peak', 'valley', 'ski'];
  const natureTerms = ['lake', 'forest', 'national park', 'waterfall', 'nature', 'fjord'];
  const cityTerms = ['city', 'capital', 'urban', 'museum', 'shopping'];

  places.forEach(place => {
    features.countries.add(place.country?.toLowerCase());

    const text = `${place.shortName} ${place.notes || ''} ${place.wantToVisitReason || ''}`.toLowerCase();

    if (coastalTerms.some(t => text.includes(t))) features.hasCoastal = true;
    if (historicTerms.some(t => text.includes(t))) features.hasHistoric = true;
    if (mountainTerms.some(t => text.includes(t))) features.hasMountains = true;
    if (natureTerms.some(t => text.includes(t))) features.hasNature = true;
    if (cityTerms.some(t => text.includes(t))) features.hasCities = true;
  });

  return features;
}

// Score a destination based on user preferences
function scoreDestination(destination, features, savedPlaces) {
  let score = 0;
  const reasons = [];

  // Check if already saved
  const isSaved = savedPlaces.some(p =>
    p.shortName?.toLowerCase() === destination.name.toLowerCase() ||
    (Math.abs(p.lat - destination.lat) < 0.1 && Math.abs(p.lon - destination.lon) < 0.1)
  );
  if (isSaved) return { score: -1, reasons: [] };

  // Bonus for similar countries/regions
  const savedCountries = Array.from(features.countries);
  if (savedCountries.some(c => destination.country.toLowerCase().includes(c))) {
    score += 2;
    reasons.push(`You've enjoyed ${destination.country} before`);
  }

  // Match tags to preferences
  if (features.hasCoastal && destination.tags.some(t => ['coastal', 'mediterranean', 'island', 'beaches'].includes(t))) {
    score += 3;
    reasons.push('Matches your love of coastal destinations');
  }
  if (features.hasHistoric && destination.tags.some(t => ['historic', 'medieval', 'castle', 'roman', 'gothic'].includes(t))) {
    score += 3;
    reasons.push('Rich in history like places you enjoy');
  }
  if (features.hasMountains && destination.tags.some(t => ['mountains', 'alps', 'hiking', 'valley'].includes(t))) {
    score += 3;
    reasons.push('Mountain scenery you seem to love');
  }
  if (features.hasNature && destination.tags.some(t => ['nature', 'lake', 'waterfalls', 'national-park', 'fjords'].includes(t))) {
    score += 3;
    reasons.push('Natural beauty similar to your favorites');
  }
  if (features.hasCities && destination.tags.some(t => ['city', 'urban', 'nightlife'].includes(t))) {
    score += 2;
    reasons.push('Vibrant city experience');
  }

  // Add some randomness to avoid always showing the same top picks
  score += Math.random() * 1.5;

  return { score, reasons };
}

export function getRecommendation(savedPlaces) {
  if (!savedPlaces || savedPlaces.length === 0) {
    // Return a random popular destination for new users
    const popular = EUROPEAN_DESTINATIONS.filter(d =>
      ['Prague', 'Lisbon', 'Dubrovnik', 'Santorini', 'Lake Bled'].includes(d.name)
    );
    const pick = popular[Math.floor(Math.random() * popular.length)];
    return {
      ...pick,
      reason: `${pick.name} is one of Europe's most beloved destinations. ${pick.description}.`,
    };
  }

  const features = analyzeSavedPlaces(savedPlaces);

  // Score all destinations
  const scored = EUROPEAN_DESTINATIONS.map(dest => ({
    ...dest,
    ...scoreDestination(dest, features, savedPlaces),
  })).filter(d => d.score > 0);

  if (scored.length === 0) {
    // Fallback: return a random destination not yet saved
    const unsaved = EUROPEAN_DESTINATIONS.filter(dest =>
      !savedPlaces.some(p =>
        p.shortName?.toLowerCase() === dest.name.toLowerCase()
      )
    );
    const pick = unsaved[Math.floor(Math.random() * unsaved.length)] || EUROPEAN_DESTINATIONS[0];
    return {
      ...pick,
      reason: `Discover something new! ${pick.description}.`,
    };
  }

  // Sort by score and pick the top one
  scored.sort((a, b) => b.score - a.score);
  const winner = scored[0];

  // Build reason string
  const reasonText = winner.reasons.length > 0
    ? winner.reasons.slice(0, 2).join('. ') + '.'
    : winner.description;

  return {
    ...winner,
    reason: reasonText,
  };
}
