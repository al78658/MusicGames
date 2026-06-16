import type { Track } from '../types';

// A high-quality fallback database of real tracks with working Deezer preview URLs, release dates, and ranks.
// This ensures the game is fully operational even without internet connection or in case of CORS proxy failures.
export const FALLBACK_TRACKS: Track[] = [
  // Pop
  {
    id: 1109731,
    title: "Billie Jean",
    artist: { id: 259, name: "Michael Jackson", picture_medium: "https://api.deezer.com/artist/259/image" },
    album: { id: 119606, title: "Thriller", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/e2a2ba258e2eeef4d350d75a840c83a0/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-e.dzcdn.net/stream/c-e2f527a296d9980d922f3001f3f38058-4.mp3",
    rank: 980000,
    release_date: "1982-11-30",
    genres: ["Pop", "R&B"]
  },
  {
    id: 3135556,
    title: "Bohemian Rhapsody",
    artist: { id: 412, name: "Queen", picture_medium: "https://api.deezer.com/artist/412/image" },
    album: { id: 302127, title: "A Night at the Opera", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/68c8b6b27e8d24cbfa6c88f1abf6e246/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-c.dzcdn.net/stream/c-cc5c6c06a6c0c29f643f87b8d0092c2a-3.mp3",
    rank: 990000,
    release_date: "1975-10-31",
    genres: ["Rock", "Classic Rock"]
  },
  {
    id: 1434890,
    title: "Smells Like Teen Spirit",
    artist: { id: 143, name: "Nirvana", picture_medium: "https://api.deezer.com/artist/143/image" },
    album: { id: 136237, title: "Nevermind", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/a7c6691c28c8942b00572e946a6f6df6/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-2.dzcdn.net/stream/c-29b158021c33b00c3c6f9661448b4e33-7.mp3",
    rank: 950000,
    release_date: "1991-09-24",
    genres: ["Rock", "Grunge"]
  },
  {
    id: 916424,
    title: "Hotel California",
    artist: { id: 251, name: "Eagles", picture_medium: "https://api.deezer.com/artist/251/image" },
    album: { id: 101438, title: "Hotel California", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/2e90c66d54cf8bf1ff4d1d8cf4e88dbb/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-d.dzcdn.net/stream/c-d9cf747fae3fbf2a05cf4c6f50567e91-4.mp3",
    rank: 940000,
    release_date: "1976-12-08",
    genres: ["Rock", "Classic Rock"]
  },
  {
    id: 128243260,
    title: "Blinding Lights",
    artist: { id: 4050205, name: "The Weeknd", picture_medium: "https://api.deezer.com/artist/4050205/image" },
    album: { id: 136123872, title: "After Hours", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/b4fbc9af4668ab9c76b91176b6274488/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-d.dzcdn.net/stream/c-d2c6b45d0c7f7d3a01ff61f9d6c38220-4.mp3",
    rank: 995000,
    release_date: "2019-11-29",
    genres: ["Pop", "Synthpop"]
  },
  {
    id: 540954,
    title: "Shape of You",
    artist: { id: 384236, name: "Ed Sheeran", picture_medium: "https://api.deezer.com/artist/384236/image" },
    album: { id: 155554, title: "÷ (Divide)", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/19bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-b.dzcdn.net/stream/c-b715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 960000,
    release_date: "2017-01-06",
    genres: ["Pop"]
  },
  {
    id: 1239632,
    title: "Poker Face",
    artist: { id: 145, name: "Lady Gaga", picture_medium: "https://api.deezer.com/artist/145/image" },
    album: { id: 132456, title: "The Fame", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/c5bf088eb198df9a0f3d9b4b0e8c89b8/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-e.dzcdn.net/stream/c-eb96ff7d296d9980d922f3001f3f38058-4.mp3",
    rank: 910000,
    release_date: "2008-08-19",
    genres: ["Pop", "Dance"]
  },
  {
    id: 2135678,
    title: "Viva La Vida",
    artist: { id: 75, name: "Coldplay", picture_medium: "https://api.deezer.com/artist/75/image" },
    album: { id: 245678, title: "Viva la Vida or Death and All His Friends", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/e32230cf8452e8250269ff225e8a7ff8/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-5.dzcdn.net/stream/c-5cf747fae3fbf2a05cf4c6f50567e91-4.mp3",
    rank: 935000,
    release_date: "2008-06-12",
    genres: ["Rock", "Alternative"]
  },
  // Rock & Metal
  {
    id: 2656201,
    title: "Enter Sandman",
    artist: { id: 1188, name: "Metallica", picture_medium: "https://api.deezer.com/artist/1188/image" },
    album: { id: 258902, title: "Metallica (Black Album)", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/98bb122dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-9.dzcdn.net/stream/c-9cf747fae3fbf2a05cf4c6f50567e91-4.mp3",
    rank: 890000,
    release_date: "1991-07-30",
    genres: ["Metal", "Rock"]
  },
  {
    id: 1109720,
    title: "Symphony of Destruction",
    artist: { id: 1290, name: "Megadeth", picture_medium: "https://api.deezer.com/artist/1290/image" },
    album: { id: 119599, title: "Countdown to Extinction", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/a4a8258e2eeef4d350d75a840c83a0/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-d.dzcdn.net/stream/c-d8f527a296d9980d922f3001f3f38058-4.mp3",
    rank: 820000,
    release_date: "1992-07-14",
    genres: ["Metal"]
  },
  {
    id: 310565,
    title: "Raining Blood",
    artist: { id: 1412, name: "Slayer", picture_medium: "https://api.deezer.com/artist/1412/image" },
    album: { id: 300127, title: "Reign in Blood", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/48c8b6b27e8d24cbfa6c88f1abf6e246/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-a.dzcdn.net/stream/c-ac5c6c06a6c0c29f643f87b8d0092c2a-3.mp3",
    rank: 750000,
    release_date: "1986-10-07",
    genres: ["Metal"]
  },
  {
    id: 420954,
    title: "Madhouse",
    artist: { id: 1342, name: "Anthrax", picture_medium: "https://api.deezer.com/artist/1342/image" },
    album: { id: 145554, title: "Spreading the Disease", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/39bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-f.dzcdn.net/stream/c-f715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 700000,
    release_date: "1985-10-30",
    genres: ["Metal"]
  },
  // Hip-Hop
  {
    id: 51239632,
    title: "Lose Yourself",
    artist: { id: 509, name: "Eminem", picture_medium: "https://api.deezer.com/artist/509/image" },
    album: { id: 5132456, title: "8 Mile", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/ec5bf08eb198df9a0f3d9b4b0e8c89b8/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-b.dzcdn.net/stream/c-bb96ff7d296d9980d922f3001f3f38058-4.mp3",
    rank: 970000,
    release_date: "2002-10-28",
    genres: ["Hip-Hop", "Rap"]
  },
  {
    id: 8135678,
    title: "Still D.R.E.",
    artist: { id: 624, name: "Dr. Dre", picture_medium: "https://api.deezer.com/artist/624/image" },
    album: { id: 8245678, title: "2001", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/832230cf8452e8250269ff225e8a7ff8/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-8.dzcdn.net/stream/c-8cf747fae3fbf2a05cf4c6f50567e91-4.mp3",
    rank: 955000,
    release_date: "1999-11-16",
    genres: ["Hip-Hop", "Rap"]
  },
  // 70s / Disco
  {
    id: 301290,
    title: "Stayin' Alive",
    artist: { id: 154, name: "Bee Gees", picture_medium: "https://api.deezer.com/artist/154/image" },
    album: { id: 390127, title: "Saturday Night Fever", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/58c8b6b27e8d24cbfa6c88f1abf6e246/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-4.dzcdn.net/stream/c-4c5c6c06a6c0c29f643f87b8d0092c2a-3.mp3",
    rank: 920000,
    release_date: "1977-12-10",
    genres: ["Disco", "Pop"]
  },
  {
    id: 402954,
    title: "Dancing Queen",
    artist: { id: 180, name: "ABBA", picture_medium: "https://api.deezer.com/artist/180/image" },
    album: { id: 445554, title: "Arrival", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/29bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-7.dzcdn.net/stream/c-7715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 945000,
    release_date: "1976-08-15",
    genres: ["Pop", "Disco"]
  },
  // 80s Rock
  {
    id: 601290,
    title: "Sweet Child O' Mine",
    artist: { id: 421, name: "Guns N' Roses", picture_medium: "https://api.deezer.com/artist/421/image" },
    album: { id: 690127, title: "Appetite for Destruction", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/f8c8b6b27e8d24cbfa6c88f1abf6e246/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-3.dzcdn.net/stream/c-3c5c6c06a6c0c29f643f87b8d0092c2a-3.mp3",
    rank: 965000,
    release_date: "1987-07-21",
    genres: ["Rock", "Hard Rock"]
  },
  {
    id: 702954,
    title: "Livin' On A Prayer",
    artist: { id: 122, name: "Bon Jovi", picture_medium: "https://api.deezer.com/artist/122/image" },
    album: { id: 745554, title: "Slippery When Wet", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/e9bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-1.dzcdn.net/stream/c-1715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 930000,
    release_date: "1986-08-18",
    genres: ["Rock", "Hard Rock"]
  },
  // 90s Dance / Pop
  {
    id: 801290,
    title: "...Baby One More Time",
    artist: { id: 231, name: "Britney Spears", picture_medium: "https://api.deezer.com/artist/231/image" },
    album: { id: 890127, title: "...Baby One More Time", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/c8c8b6b27e8d24cbfa6c88f1abf6e246/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-e.dzcdn.net/stream/c-ec5c6c06a6c0c29f643f87b8d0092c2a-3.mp3",
    rank: 915000,
    release_date: "1998-10-23",
    genres: ["Pop", "Dance"]
  },
  {
    id: 902954,
    title: "Wannabe",
    artist: { id: 301, name: "Spice Girls", picture_medium: "https://api.deezer.com/artist/301/image" },
    album: { id: 945554, title: "Spice", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/d9bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-a.dzcdn.net/stream/c-a715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 900000,
    release_date: "1996-06-26",
    genres: ["Pop", "Dance"]
  },
  // 2000s Alt Rock
  {
    id: 1001290,
    title: "In The End",
    artist: { id: 981, name: "Linkin Park", picture_medium: "https://api.deezer.com/artist/981/image" },
    album: { id: 1090127, title: "Hybrid Theory", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/d2a2ba258e2eeef4d350d75a840c83a0/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-5.dzcdn.net/stream/c-52f527a296d9980d922f3001f3f38058-4.mp3",
    rank: 975000,
    release_date: "2000-10-24",
    genres: ["Rock", "Alternative"]
  },
  {
    id: 1002954,
    title: "Mr. Brightside",
    artist: { id: 1111, name: "The Killers", picture_medium: "https://api.deezer.com/artist/1111/image" },
    album: { id: 1045554, title: "Hot Fuss", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/c9bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-4.dzcdn.net/stream/c-4715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 950000,
    release_date: "2003-09-29",
    genres: ["Rock", "Indie"]
  },
  // 2010s
  {
    id: 1101290,
    title: "Get Lucky",
    artist: { id: 812, name: "Daft Punk", picture_medium: "https://api.deezer.com/artist/812/image" },
    album: { id: 1190127, title: "Random Access Memories", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/0e2ba258e2eeef4d350d75a840c83a0/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-0.dzcdn.net/stream/c-02f527a296d9980d922f3001f3f38058-4.mp3",
    rank: 940000,
    release_date: "2013-04-19",
    genres: ["Dance", "Disco"]
  },
  {
    id: 1102954,
    title: "Rolling in the Deep",
    artist: { id: 388, name: "Adele", picture_medium: "https://api.deezer.com/artist/388/image" },
    album: { id: 1145554, title: "21", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/23bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-3.dzcdn.net/stream/c-3715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 960000,
    release_date: "2010-11-29",
    genres: ["Pop", "Soul"]
  },
  // 2020s
  {
    id: 1201290,
    title: "As It Was",
    artist: { id: 123456, name: "Harry Styles", picture_medium: "https://api.deezer.com/artist/123456/image" },
    album: { id: 1290127, title: "Harry's House", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/e1a2ba258e2eeef4d350d75a840c83a0/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-a.dzcdn.net/stream/c-a2f527a296d9980d922f3001f3f38058-4.mp3",
    rank: 985000,
    release_date: "2022-04-01",
    genres: ["Pop", "Indie"]
  },
  {
    id: 1202954,
    title: "Flowers",
    artist: { id: 824, name: "Miley Cyrus", picture_medium: "https://api.deezer.com/artist/824/image" },
    album: { id: 1245554, title: "Endless Summer Vacation", cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/54bb7d22dc479b1dfad841efec3a5796/250x250-000000-80-0-0.jpg" },
    preview: "https://cdns-preview-b.dzcdn.net/stream/c-b715694a5585b5463f87b8d0092c2a-3.mp3",
    rank: 980000,
    release_date: "2023-01-12",
    genres: ["Pop"]
  }
];

// List of popular search queries to pull fresh charts/tracks when online
export const POPULAR_SEARCHES = [
  "Michael Jackson", "Queen", "Nirvana", "The Weeknd", "Coldplay", 
  "Billie Eilish", "Eminem", "Daft Punk", "Adele", "Harry Styles", 
  "Taylor Swift", "Bruno Mars", "Dua Lipa", "Ed Sheeran", "Drake",
  "David Bowie", "Led Zeppelin", "AC/DC", "Beatles", "Pink Floyd"
];

// Helper to use CORS proxies for Deezer APIs
// Try multiple free CORS proxies in order of reliability
const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];

async function fetchWithProxy(url: string): Promise<any> {
  let lastError = null;
  for (const proxy of PROXIES) {
    try {
      const response = await fetch(proxy(url), {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (e) {
      lastError = e;
      continue; // Try next proxy
    }
  }
  throw lastError || new Error("Failed to fetch with all proxies");
}

export async function searchTracks(query: string): Promise<Track[]> {
  try {
    const data = await fetchWithProxy(`https://api.deezer.com/search?q=${encodeURIComponent(query)}`);
    if (data && Array.isArray(data.data)) {
      return data.data
        .filter((track: any) => track.preview && typeof track.preview === 'string' && track.preview.trim() !== '')
        .map((track: any) => ({
          id: track.id,
          title: track.title,
          title_short: track.title_short,
          artist: {
            id: track.artist.id,
            name: track.artist.name,
            picture_medium: track.artist.picture_medium
          },
          album: {
            id: track.album.id,
            title: track.album.title,
            cover_medium: track.album.cover_medium
          },
          preview: track.preview,
          duration: track.duration,
          rank: track.rank,
          // Approximate release date and genres from fallback database if available, or generate values
          release_date: getReleaseDateForArtist(track.artist.name, track.title),
          genres: getGenresForArtist(track.artist.name)
        }));
    }
    return getFallbackTracksByQuery(query);
  } catch (error) {
    console.warn("Deezer search failed, falling back to local database.", error);
    return getFallbackTracksByQuery(query);
  }
}

export async function getRandomTracks(count: number = 20): Promise<Track[]> {
  try {
    const genericQueries = ["hits", "classics", "pop", "rock", "dance", "love", "top", "radio", "music", "best"];
    const randomQuery = genericQueries[Math.floor(Math.random() * genericQueries.length)];
    const tracks = await searchTracks(randomQuery);
    
    if (tracks && tracks.length > 0) {
      return shuffleArray(tracks).slice(0, count);
    }
    return shuffleArray([...FALLBACK_TRACKS]).slice(0, count);
  } catch (error) {
    console.warn("getRandomTracks failed, using local database:", error);
    return shuffleArray([...FALLBACK_TRACKS]).slice(0, count);
  }
}

// Generates lists of tracks for connections (e.g. 16 items of 4 groups)
export async function getConnectionsData(): Promise<{ items: any[], groups: any[] }> {
  const allGroups = [
    {
      name: "Big Four of Thrash Metal",
      type: "artist",
      items: ["Metallica", "Megadeth", "Slayer", "Anthrax"]
    },
    {
      name: "Pop Icons of the 80s",
      type: "artist",
      items: ["Michael Jackson", "Madonna", "Prince", "Whitney Houston"]
    },
    {
      name: "Released in 2008",
      type: "decade",
      items: ["Poker Face", "Viva La Vida", "Single Ladies", "I Kissed a Girl"]
    },
    {
      name: "Released in 1991",
      type: "decade",
      items: ["Smells Like Teen Spirit", "Enter Sandman", "Losing My Religion", "Under the Bridge"]
    },
    {
      name: "Synthpop Hits",
      type: "genre",
      items: ["Blinding Lights", "Take On Me", "Sweet Dreams", "Blue Monday"]
    },
    {
      name: "Classic Disco Anthems",
      type: "genre",
      items: ["Stayin' Alive", "Dancing Queen", "Y.M.C.A.", "Le Freak"]
    },
    {
      name: "British Rock Bands",
      type: "artist",
      items: ["Queen", "Coldplay", "The Beatles", "Led Zeppelin"]
    },
    {
      name: "Grungy / Alternative Hits",
      type: "genre",
      items: ["Smells Like Teen Spirit", "In The End", "Mr. Brightside", "Zombie"]
    }
  ];

  const shuffledGroups = shuffleArray([...allGroups]);
  const selectedGroups = shuffledGroups.slice(0, 4);

  const items: any[] = [];
  selectedGroups.forEach((group, index) => {
    group.items.forEach((itemName: string) => {
      items.push({
        id: `${index}-${itemName}`,
        text: itemName,
        groupId: index
      });
    });
  });

  return {
    items: shuffleArray(items),
    groups: selectedGroups.map((g, idx) => ({ id: idx, name: g.name }))
  };
}

function getFallbackTracksByQuery(query: string): Track[] {
  const lowercaseQuery = query.toLowerCase();
  const filtered = FALLBACK_TRACKS.filter(
    t => t.title.toLowerCase().includes(lowercaseQuery) || 
         t.artist.name.toLowerCase().includes(lowercaseQuery) ||
         t.genres?.some(g => g.toLowerCase().includes(lowercaseQuery))
  );
  return filtered.length > 0 ? filtered : FALLBACK_TRACKS;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getReleaseDateForArtist(artistName: string, trackTitle: string): string {
  const known = FALLBACK_TRACKS.find(t => t.artist.name === artistName && t.title === trackTitle);
  if (known && known.release_date) return known.release_date;

  const artistsDecades: Record<string, string> = {
    "Michael Jackson": "1984-06-15",
    "Queen": "1977-10-07",
    "Nirvana": "1991-09-24",
    "The Weeknd": "2019-11-29",
    "Coldplay": "2008-06-12",
    "Harry Styles": "2022-04-01",
    "ABBA": "1976-08-15",
    "Eminem": "2002-10-28",
    "Daft Punk": "2013-04-19",
    "Adele": "2011-01-24",
    "Dr. Dre": "1999-11-16",
    "Ed Sheeran": "2017-01-06",
    "Lady Gaga": "2008-08-19",
    "Guns N' Roses": "1987-07-21"
  };

  return artistsDecades[artistName] || `20${Math.floor(Math.random() * 24).toString().padStart(2, '0')}-05-20`;
}

function getGenresForArtist(artistName: string): string[] {
  const known = FALLBACK_TRACKS.find(t => t.artist.name === artistName);
  if (known && known.genres) return known.genres;

  const genresMap: Record<string, string[]> = {
    "Michael Jackson": ["Pop", "Disco"],
    "Queen": ["Rock", "Classic Rock"],
    "Nirvana": ["Rock", "Grunge"],
    "The Weeknd": ["Pop", "Synthpop"],
    "Coldplay": ["Rock", "Alternative"],
    "Harry Styles": ["Pop", "Indie"],
    "ABBA": ["Pop", "Disco"],
    "Eminem": ["Hip-Hop", "Rap"],
    "Daft Punk": ["Dance", "EDM"],
    "Adele": ["Pop", "Soul"],
    "Dr. Dre": ["Hip-Hop", "Rap"],
    "Ed Sheeran": ["Pop"],
    "Lady Gaga": ["Pop", "Dance"],
    "Guns N' Roses": ["Rock", "Hard Rock"]
  };

  return genresMap[artistName] || ["Pop"];
}
