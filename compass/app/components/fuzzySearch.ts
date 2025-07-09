import Fuse from 'fuse.js';

export async function getCachedLocations() {
  const response = await caches.match('/locations.json');
  if (!response) return [];
  return response.json();
}

export async function fuzzySearchWithFallback(query: string, threshold = 0.3) {
  const locations = await getCachedLocations();
  const fuse = new Fuse(locations, {
     keys: ['name'],
     //later we can add other keys depending on the need
    includeScore: true,
    threshold, 
  });

  const results = fuse.search(query);

  if (results.length > 0 && results[0]?.score !== undefined && results[0].score <= threshold) {
    return {
      source: 'cache',
      data: results.map(r => r.item)
    };
  }
  // we need to comment out it with correct api, i will do it after merging of codes
  // try {
  //   const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
  //   const data = await res.json();
  //   return {
  //     source: 'backend',
  //     data
  //   };
  // } catch (err) {
  //   console.error('Backend search failed:', err);
  //   return {
  //     source: 'none',
  //     data: []
  //   };
  // }

  return {
      source: 'none',
      data: []
    };
}

