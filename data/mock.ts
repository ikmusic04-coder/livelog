export type LiveType = 'wanman' | 'taiban' | 'fes' | 'haishin'

export interface MockLive {
  id: string
  title: string
  artists: string[]
  date: string
  venue: string
  type: LiveType
  hasSetlist: boolean
  attendCount: number
  friends: string[]
  flyerEmoji: string
  accentColor: string
}

export interface MockSong {
  id: string
  order: number
  title: string
  note: string
  isFavorite: boolean
}

export interface MockArtist {
  id: string
  name: string
  genre: string
  count: number
  status: 'seen' | 'wishlist'
  emoji: string
}

export const mockLives: MockLive[] = [
  {
    id: '1',
    title: 'Dome Tour 2025 "Idenshi"',
    artists: ['King Gnu'],
    date: '2025.11.23',
    venue: '東京ドーム',
    type: 'wanman',
    hasSetlist: true,
    attendCount: 7,
    friends: ['A', 'B'],
    flyerEmoji: '🎸',
    accentColor: '#9a7a82',
  },
  {
    id: '2',
    title: 'Arena Tour 2025',
    artists: ['YOASOBI'],
    date: '2025.10.11',
    venue: 'さいたまスーパーアリーナ',
    type: 'wanman',
    hasSetlist: true,
    attendCount: 3,
    friends: [],
    flyerEmoji: '🎹',
    accentColor: '#7a8fa0',
  },
  {
    id: '3',
    title: 'Summer Sonic 2025',
    artists: ['Billie Eilish', 'The 1975', 'Sabrina Carpenter'],
    date: '2025.08.16',
    venue: '幕張メッセ',
    type: 'fes',
    hasSetlist: false,
    attendCount: 1,
    friends: ['C'],
    flyerEmoji: '🪩',
    accentColor: '#7a9a8a',
  },
]

export const mockSetlist: MockSong[] = [
  { id: '1', order: 1, title: '三原色', note: '', isFavorite: true },
  { id: '2', order: 2, title: '飛行艇', note: '', isFavorite: false },
  { id: '3', order: 3, title: '白日', note: 'アコースティックアレンジ', isFavorite: true },
  { id: '4', order: 4, title: 'Slumberland', note: '', isFavorite: false },
  { id: '5', order: 5, title: '無窮窓', note: '', isFavorite: false },
]

export const mockArtists: MockArtist[] = [
  { id: '1', name: 'King Gnu', genre: 'オルタナ・ロック', count: 7, status: 'seen', emoji: '🎸' },
  { id: '2', name: 'Official髭男dism', genre: 'J-Pop', count: 4, status: 'seen', emoji: '🎹' },
  { id: '3', name: 'YOASOBI', genre: 'J-Pop', count: 3, status: 'seen', emoji: '🎵' },
  { id: '4', name: 'Slowdive', genre: 'シューゲイザー', count: 0, status: 'wishlist', emoji: '🫧' },
  { id: '5', name: 'My Bloody Valentine', genre: 'シューゲイザー', count: 0, status: 'wishlist', emoji: '🩸' },
]
