import { Anime, ServerOption } from '../types/anime';

// Real streaming anime sample videos (Blender open animation & anime trailers/clips)
const SAMPLE_STREAMS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

export const SERVERS: ServerOption[] = [
  { id: 'anikoto', name: 'Anikoto ★', isStarred: true, speed: 'Ultra', supportsDub: true, supportsSub: true, supportsDownload: true },
  { id: 'animepahe', name: 'AnimePahe', isStarred: false, speed: 'Fast', supportsDub: false, supportsSub: true, supportsDownload: true },
  { id: 'bee', name: 'Bee', isStarred: false, speed: 'Ultra', supportsDub: true, supportsSub: true, supportsDownload: false },
  { id: 'lili', name: 'Lili Direct', isStarred: true, speed: 'Ultra', supportsDub: true, supportsSub: true, supportsDownload: true },
  { id: 'zoko', name: 'Zoko Multi', isStarred: false, speed: 'Fast', supportsDub: true, supportsSub: true, supportsDownload: true },
  { id: 'anipm', name: 'Ani.pm', isStarred: false, speed: 'Fast', supportsDub: false, supportsSub: true, supportsDownload: false },
  { id: 'sun', name: 'Sun (1080p)', isStarred: false, speed: 'Normal', supportsDub: true, supportsSub: true, supportsDownload: true },
];

export const ANIME_CATALOG: Anime[] = [
  {
    id: 'gushing-over-magical-girls',
    title: 'Gushing Over Magical Girls',
    romajiTitle: 'Mahou Shoujo ni Akogarete',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    score: 74,
    format: 'TV',
    year: 2024,
    status: 'Finished',
    durationMins: 24,
    genres: ['Comedy', 'Ecchi', 'Mahou Shoujo', 'Slice of Life'],
    synopsis: 'Hiiragi Utena is a major fangirl of the magical girls protecting her city, so when she has the chance to become one herself, she leaps at the chance to join their technicolor ranks... but when she transforms, she learns she isn’t fated to be a daring do-gooder, but rather a villain on the side of evil! At first she tries to quit, but discovers an unexpected sadistic streak.',
    studio: 'Asahi Production',
    startDate: '1/3/2024',
    seasonName: 'Winter',
    membersCount: 79919,
    trailerUrl: SAMPLE_STREAMS[3],
    hasDub: true,
    hasSub: true,
    airSchedule: {
      dayOfWeek: 3, // Wednesday
      airTime: '23:30',
      nextEpisode: 13
    },
    seasons: [
      {
        id: 'gomg-s1',
        number: 1,
        title: 'Season 1',
        year: 2024,
        episodes: [
          {
            id: 'gomg-ep-1',
            number: 1,
            title: 'A Villain Is Born?!',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[0],
            synopsis: 'Utena Hiiragi loves magical girls more than anything. One evening, a mysterious flying creature named Venalita appears with a sinister contract.',
            airedDate: 'Jan 3, 2024'
          },
          {
            id: 'gomg-ep-2',
            number: 2,
            title: 'Her Name Is Magia Baiser!',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[1],
            synopsis: 'Utena discovers her alter ego Magia Baiser has formidable sadistic powers that fluster even the Tres Magia.',
            airedDate: 'Jan 10, 2024'
          },
          {
            id: 'gomg-ep-3',
            number: 3,
            title: 'The Explosive Leopard!',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[2],
            synopsis: 'A wild new villain named Leopard appears, armed with an arsenal of explosive military gear and an untamable temperament.',
            airedDate: 'Jan 17, 2024'
          },
          {
            id: 'gomg-ep-4',
            number: 4,
            title: 'Everyone Loves the Tres Magia!',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[3],
            synopsis: 'The Tres Magia hold a public concert and photo shoot, but Enormeeta arrives to turn the event upside down.',
            airedDate: 'Jan 24, 2024'
          },
          {
            id: 'gomg-ep-5',
            number: 5,
            title: 'NeroAlice in Wonderland',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[0],
            synopsis: 'The introverted dollmaker Alice Morino traps both villains and heroes inside her fantastical toy realm.',
            airedDate: 'Jan 31, 2024'
          },
          {
            id: 'gomg-ep-6',
            number: 6,
            title: 'Tres Magia: Secret Training',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[1],
            synopsis: 'Feeling outmatched, the magical girls undergo an intense mountain retreat training camp.',
            airedDate: 'Feb 7, 2024'
          },
          {
            id: 'gomg-ep-7',
            number: 7,
            title: 'Lord Enorme Unleashed',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[2],
            synopsis: 'Internal conflict within the villain syndicate boils over as Lord Enorme challenges Utena.',
            airedDate: 'Feb 14, 2024'
          },
          {
            id: 'gomg-ep-8',
            number: 8,
            title: 'Magia Azure’s Trial',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[3],
            synopsis: 'Azure is trapped alone and begins to question her devotion to justice.',
            airedDate: 'Feb 21, 2024'
          },
          {
            id: 'gomg-ep-9',
            number: 9,
            title: 'Idol Idol Showdown',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[0],
            synopsis: 'A musical clash occurs in the city plaza with high voltage performances.',
            airedDate: 'Feb 28, 2024'
          },
          {
            id: 'gomg-ep-10',
            number: 10,
            title: 'Loco Musica & Leberblume',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[1],
            synopsis: 'A duo of villains plot an unconventional assault using subsonic acoustics.',
            airedDate: 'Mar 6, 2024'
          },
          {
            id: 'gomg-ep-11',
            number: 11,
            title: 'Conquer the Sky',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[2],
            synopsis: 'The sky over the city turns violet as the ultimate showdown begins.',
            airedDate: 'Mar 13, 2024'
          },
          {
            id: 'gomg-ep-12',
            number: 12,
            title: 'The Journey Continues',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[3],
            synopsis: 'A quiet day off at the amusement park takes an unexpected turn.',
            airedDate: 'Mar 20, 2024'
          },
          {
            id: 'gomg-ep-13',
            number: 13,
            title: 'I Still Love Magical Girls!',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[0],
            synopsis: 'The season finale sees Utena reaffirming her chaotic yet earnest passion.',
            airedDate: 'Mar 27, 2024'
          }
        ]
      }
    ],
    related: [
      {
        id: 'gomg-s1',
        title: 'Gushing Over Magical Girls',
        relation: 'Season 1',
        format: 'TV',
        year: 2024,
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
        episodesCount: 13
      },
      {
        id: 'gomg-s2',
        title: 'Mahou Shoujo ni Akogarete 2nd Season',
        relation: 'Season 2',
        format: 'TV',
        year: 2025,
        poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
        episodesCount: 12
      },
      {
        id: 'prisma-illya',
        title: 'Fate/kaleid liner Prisma☆Illya',
        relation: 'More like this',
        format: 'ONA',
        year: 2013,
        poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'kill-la-kill',
        title: 'Kill la Kill',
        relation: 'More like this',
        format: 'TV',
        year: 2013,
        poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'apothecary-diaries-s3',
    title: 'The Apothecary Diaries Season 3',
    romajiTitle: 'Kusuriya no Hitorigoto 3rd Season',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    score: 85,
    format: 'TV',
    year: 2026,
    status: 'Releasing',
    durationMins: 24,
    genres: ['Drama', 'Mystery', 'Historical'],
    synopsis: 'In the aftermath of the Shi Clan’s rebellion, things have finally settled down, and Maomao has returned to her beloved inner palace duties. But mysterious medicinal poisoning occurrences whisper of deeper plots spanning neighboring kingdoms.',
    studio: 'TOHO animation STUDIO / OLM',
    startDate: '10/5/2026',
    seasonName: 'Fall',
    membersCount: 142050,
    trailerUrl: SAMPLE_STREAMS[1],
    hasDub: true,
    hasSub: true,
    airSchedule: {
      dayOfWeek: 5, // Friday
      airTime: '23:05',
      nextEpisode: 6
    },
    seasons: [
      {
        id: 'ad-s3',
        number: 3,
        title: 'Season 3',
        year: 2026,
        episodes: [
          {
            id: 'ad-ep-1',
            number: 1,
            title: 'Return to the Verdigris House',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[1]
          },
          {
            id: 'ad-ep-2',
            number: 2,
            title: 'A Powder of Unlikely Provenance',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[2]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'eminence-in-shadow',
    title: 'The Eminence in Shadow',
    romajiTitle: 'Kage no Jitsuryokusha ni Naritakute!',
    bannerImage: '/assets/aistudio/Screenshot_20261102_214725_Anilili_b7aba3a9.jpg',
    posterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    score: 85,
    format: 'TV',
    year: 2022,
    status: 'Finished',
    durationMins: 24,
    genres: ['Action', 'Comedy', 'Fantasy', 'Isekai'],
    synopsis: 'Great heroes and diabolical villains are the types of characters people long to be—but not Cid Kagenou. He aspires to become the mastermind behind it all, pulling the strings and showing the world the true definition of "I Am Atomic".',
    studio: 'Nexus',
    startDate: '10/5/2022',
    seasonName: 'Fall',
    membersCount: 230910,
    trailerUrl: SAMPLE_STREAMS[0],
    hasDub: true,
    hasSub: true,
    seasons: [
      {
        id: 'eis-s1',
        number: 1,
        title: 'Season 1',
        year: 2022,
        episodes: [
          {
            id: 'eis-ep-1',
            number: 1,
            title: 'The Hated Classmate',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[0]
          },
          {
            id: 'eis-ep-2',
            number: 2,
            title: 'Shadow Garden Is Born',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[1]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'tsukimichi-moonlit-fantasy',
    title: 'TSUKIMICHI -Moonlit Fantasy-',
    romajiTitle: 'Tsuki ga Michibiku Isekai Douchuu',
    bannerImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    score: 79,
    format: 'TV',
    year: 2021,
    status: 'Finished',
    durationMins: 24,
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    synopsis: 'Makoto Misumi is just an ordinary high school student summoned to another world as a brave warrior. Unfortunately, the goddess of that world said with disdain: "Your face is ugly," stripped him of his title, and banished him to the outermost edges of the wasteland.',
    studio: 'C2C / J.C.Staff',
    startDate: '7/7/2021',
    seasonName: 'Summer',
    membersCount: 165000,
    hasDub: true,
    hasSub: true,
    seasons: [
      {
        id: 'tsuki-s1',
        number: 1,
        title: 'Season 1',
        year: 2021,
        episodes: [
          {
            id: 'tsuki-ep-1',
            number: 1,
            title: 'First Step into the Wasteland',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[2]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'strongest-job-farmer',
    title: 'The strongest job is a farmer',
    romajiTitle: 'Noumin Kanren no Skill Bakka Agetetara',
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    score: 68,
    format: 'TV',
    year: 2022,
    status: 'Finished',
    durationMins: 24,
    genres: ['Action', 'Adventure', 'Fantasy'],
    synopsis: 'Al Wayne, a young man who aims to be a first-class farmer, has developed his farmer skills. However, when his farming mastery stat maxes out, something completely unexpected happens.',
    studio: 'Studio A-CAT',
    startDate: '10/1/2022',
    seasonName: 'Fall',
    membersCount: 45000,
    hasDub: true,
    hasSub: true,
    seasons: [
      {
        id: 'farmer-s1',
        number: 1,
        title: 'Season 1',
        year: 2022,
        episodes: [
          {
            id: 'farmer-ep-2',
            number: 2,
            title: 'The Farmer and the Guild',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[3]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'worlds-finest-assassin',
    title: "The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat",
    romajiTitle: 'Sekai Saikou no Ansatsusha',
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    score: 76,
    format: 'TV',
    year: 2021,
    status: 'Finished',
    durationMins: 24,
    genres: ['Action', 'Drama', 'Fantasy', 'Mystery'],
    synopsis: 'The greatest assassin on Earth knew only how to live as a tool for his employers—until they stopped letting him live. Reborn by the grace of a goddess into a world of swords and sorcery, he’s offered a chance to do things differently this time around.',
    studio: 'SILVER LINK. / Studio Palette',
    startDate: '10/6/2021',
    seasonName: 'Fall',
    membersCount: 198000,
    hasDub: true,
    hasSub: true,
    seasons: [
      {
        id: 'assassin-s1',
        number: 1,
        title: 'Season 1',
        year: 2021,
        episodes: [
          {
            id: 'assassin-ep-3',
            number: 3,
            title: 'Magic of Trust',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[0]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'eighty-six',
    title: '86 - Eighty Six',
    romajiTitle: '86 - Eighty Six',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    score: 86,
    format: 'TV',
    year: 2021,
    status: 'Finished',
    durationMins: 24,
    genres: ['Action', 'Drama', 'Sci-Fi', 'Mecha'],
    synopsis: 'The Republic of San Magnolia has long been under attack from the Giadian Empire’s unmanned legion of combat drones. Outside the eighty-five districts of the Republic exists "the nonexistent eighty-sixth sector," where youths are designated Eighty-Six and fight in unmanned drones.',
    studio: 'A-1 Pictures',
    startDate: '4/11/2021',
    seasonName: 'Spring',
    membersCount: 320000,
    hasDub: true,
    hasSub: true,
    seasons: [
      {
        id: '86-s1',
        number: 1,
        title: 'Season 1',
        year: 2021,
        episodes: [
          {
            id: '86-ep-1',
            number: 1,
            title: 'Undertaker',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[1]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'loner-life-in-another-world',
    title: 'Loner Life in Another World',
    romajiTitle: 'Hitoribocchi no Isekai Kouryaku',
    bannerImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    score: 72,
    format: 'TV',
    year: 2024,
    status: 'Finished',
    durationMins: 24,
    genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
    synopsis: 'When sarcastic loner Haruka gets transported with his high school class to another world, all the good cheat skills get snatched up by other students. Left with leftovers, he makes the most of being a solo adventurer.',
    studio: 'Hayabusa Film / Passione',
    startDate: '10/4/2024',
    seasonName: 'Fall',
    membersCount: 68000,
    hasDub: true,
    hasSub: true,
    seasons: [
      {
        id: 'loner-s1',
        number: 1,
        title: 'Season 1',
        year: 2024,
        episodes: [
          {
            id: 'loner-ep-1',
            number: 1,
            title: 'Loner’s Leftover Skills',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[2]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'mushoku-tensei-3',
    title: 'Mushoku Tensei III: Isekai Ittara Honki Dasu',
    romajiTitle: 'Mushoku Tensei: Jobless Reincarnation Season 3',
    bannerImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    score: 89,
    format: 'TV',
    year: 2026,
    status: 'Releasing',
    durationMins: 24,
    genres: ['Drama', 'Fantasy', 'Adventure'],
    synopsis: 'Rudeus Greyrat ventures further across the central continent, facing impending destiny and the trials of fatherhood and ancient dragon gods.',
    studio: 'Studio Bind',
    startDate: '4/7/2026',
    seasonName: 'Spring',
    membersCount: 390000,
    hasDub: true,
    hasSub: true,
    airSchedule: {
      dayOfWeek: 0, // Sunday
      airTime: '24:00',
      nextEpisode: 4
    },
    seasons: [
      {
        id: 'mt-s3',
        number: 3,
        title: 'Season 3',
        year: 2026,
        episodes: [
          {
            id: 'mt-ep-1',
            number: 1,
            title: 'The Letter from Begaritt',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[3]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'frieren-journey-end',
    title: "Frieren: Beyond Journey's End",
    romajiTitle: 'Sousou no Frieren',
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    score: 93,
    format: 'TV',
    year: 2023,
    status: 'Finished',
    durationMins: 24,
    genres: ['Adventure', 'Drama', 'Fantasy'],
    synopsis: 'The demon king has been defeated, and the victorious hero party returns home before disbanding. The four—mage Frieren, hero Himmel, priest Heiter, and warrior Eisen—reminisce about their decade-long journey as the moment to say farewell arrives.',
    studio: 'Madhouse',
    startDate: '9/29/2023',
    seasonName: 'Fall',
    membersCount: 420000,
    hasDub: true,
    hasSub: true,
    seasons: [
      {
        id: 'frieren-s1',
        number: 1,
        title: 'Season 1',
        year: 2023,
        episodes: [
          {
            id: 'frieren-ep-1',
            number: 1,
            title: 'The Journey’s End',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[0]
          }
        ]
      }
    ],
    related: []
  },
  {
    id: 'solo-leveling-s2',
    title: 'Solo Leveling Season 2: Arise from the Shadow',
    romajiTitle: 'Ore dake Level Up na Ken: Season 2',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1600&auto=format&fit=crop&q=80',
    posterImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    score: 87,
    format: 'TV',
    year: 2025,
    status: 'Releasing',
    durationMins: 24,
    genres: ['Action', 'Fantasy'],
    synopsis: 'Sung Jinwoo faces the monarch crisis as the Jeju Island raid begins, testing the full might of the Shadow Monarch’s expanding army.',
    studio: 'A-1 Pictures',
    startDate: '1/4/2025',
    seasonName: 'Winter',
    membersCount: 380000,
    hasDub: true,
    hasSub: true,
    airSchedule: {
      dayOfWeek: 6, // Saturday
      airTime: '24:00',
      nextEpisode: 9
    },
    seasons: [
      {
        id: 'sl-s2',
        number: 2,
        title: 'Season 2',
        year: 2025,
        episodes: [
          {
            id: 'sl-ep-1',
            number: 1,
            title: 'You Aren’t an E-Rank Anymore',
            durationSec: 1440,
            thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
            videoUrl: SAMPLE_STREAMS[1]
          }
        ]
      }
    ],
    related: []
  }
];

export const INITIAL_CONTINUE_WATCHING: {
  animeId: string;
  episodeNumber: number;
  currentTimeSec: number;
  durationSec: number;
  serverName: string;
  audioMode: 'SUB' | 'DUB';
  updatedAt: string;
}[] = [
  {
    animeId: 'gushing-over-magical-girls',
    episodeNumber: 3,
    currentTimeSec: 216,
    durationSec: 1440,
    serverName: 'anikoto',
    audioMode: 'DUB',
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    animeId: 'tsukimichi-moonlit-fantasy',
    episodeNumber: 1,
    currentTimeSec: 420,
    durationSec: 1440,
    serverName: 'anikoto',
    audioMode: 'DUB',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    animeId: 'strongest-job-farmer',
    episodeNumber: 2,
    currentTimeSec: 680,
    durationSec: 1440,
    serverName: 'anikoto',
    audioMode: 'DUB',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    animeId: 'eminence-in-shadow',
    episodeNumber: 1,
    currentTimeSec: 960,
    durationSec: 1440,
    serverName: 'anikoto',
    audioMode: 'DUB',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    animeId: 'worlds-finest-assassin',
    episodeNumber: 3,
    currentTimeSec: 1100,
    durationSec: 1440,
    serverName: 'animepahe',
    audioMode: 'DUB',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];
