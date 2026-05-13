# LIVELOG フロントエンド 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** React Native (Expo) + Expo Router v3 でモックデータのみで動作する LIVELOG フロントエンドを完成させ、Expo Go で実機確認できる状態にする。

**Architecture:** コンポーネント先行で実装する。`constants/theme.ts` と `data/mock.ts` を基盤として先に作り、TypeBadge → Tag → FriendDots → LiveCard の順にコンポーネントを積み上げ、その後各画面を組み立てる。状態管理は useState のみ、バックエンド接続なし。

**Tech Stack:** React Native, Expo SDK 52, Expo Router v3, TypeScript, expo-image-picker, @expo-google-fonts/cormorant-garamond, @expo-google-fonts/noto-sans-jp

---

## ファイルマップ

| ファイル | 役割 |
|---|---|
| `app/_layout.tsx` | フォント読み込み・ルートスタック定義 |
| `app/(tabs)/_layout.tsx` | タブバー（2タブ） |
| `app/(tabs)/timeline.tsx` | タイムライン画面 |
| `app/(tabs)/artists.tsx` | アーティスト一覧画面 |
| `app/live/[id].tsx` | ライブ詳細・セットリスト |
| `app/live/new.tsx` | 新規ライブ登録フォーム |
| `app/artist/[id].tsx` | アーティスト詳細 |
| `app/auth/login.tsx` | ログイン画面（モック） |
| `components/TypeBadge.tsx` | 形式バッジ（ワンマン等） |
| `components/Tag.tsx` | タグ（セットリストあり等） |
| `components/FriendDots.tsx` | 友人イニシャルアイコン群 |
| `components/LiveCard.tsx` | タイムラインカード |
| `components/SongRow.tsx` | セットリスト曲行 |
| `components/AddSongModal.tsx` | 曲追加モーダル |
| `components/ArtistRow.tsx` | アーティスト一覧行 |
| `components/FilterChips.tsx` | フィルターチップ横スクロール |
| `constants/theme.ts` | カラー・タイポグラフィ・radius定数 |
| `data/mock.ts` | 全モックデータ |

> **テスト方針:** React Native UI コンポーネントは Jest テストでなく TypeScript コンパイルチェック (`npx tsc --noEmit`) + Expo Go 目視確認で検証する。

---

## Task 1: Expo プロジェクト作成

**Files:**
- Create: `livelog/` (プロジェクトルート)
- Modify: `package.json`, `app.json`, `tsconfig.json`

- [ ] **Step 1: プロジェクト作成**

```bash
cd /Users/tasakiryo
npx create-expo-app@latest livelog --template blank-typescript
cd livelog
```

- [ ] **Step 2: 追加パッケージをインストール**

```bash
npx expo install expo-router expo-image-picker @expo-google-fonts/cormorant-garamond @expo-google-fonts/noto-sans-jp expo-splash-screen expo-system-ui
```

- [ ] **Step 3: package.json の main を変更**

`package.json` の `"main"` フィールドを以下に変更する:

```json
"main": "expo-router/entry"
```

- [ ] **Step 4: app.json を更新**

```json
{
  "expo": {
    "name": "livelog",
    "slug": "livelog",
    "version": "1.0.0",
    "scheme": "livelog",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "splash": {
      "backgroundColor": "#1c1a1f"
    },
    "ios": { "supportsTablet": false },
    "android": { "adaptiveIcon": { "backgroundColor": "#1c1a1f" } },
    "plugins": ["expo-router"],
    "experiments": { "typedRoutes": true }
  }
}
```

- [ ] **Step 5: tsconfig.json を更新**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.d.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 6: デフォルトで生成されたファイルを削除**

```bash
rm -rf app/ components/ constants/ hooks/ assets/images/
mkdir -p app/\(tabs\) app/live app/artist app/auth components constants data
```

- [ ] **Step 7: git 初期化 & 初回コミット**

```bash
cd /Users/tasakiryo/livelog
git add package.json app.json tsconfig.json
git commit -m "feat: Expoプロジェクト初期セットアップ"
```

---

## Task 2: constants/theme.ts & data/mock.ts

**Files:**
- Create: `constants/theme.ts`
- Create: `data/mock.ts`

- [ ] **Step 1: constants/theme.ts を作成**

```typescript
// constants/theme.ts
export const colors = {
  bg: '#1c1a1f',
  bg2: '#242229',
  bg3: '#2e2b34',
  text1: '#d4cfe0',
  text2: '#8f8a9c',
  text3: '#5c5868',
  accent: '#a08cbb',
  accent2: '#7a6b9a',
  accentPale: 'rgba(160,140,187,0.12)',
  border: 'rgba(180,170,200,0.12)',
  border2: 'rgba(180,170,200,0.22)',
  wanman: '#9a7a82',
  taiban: '#7a8fa0',
  fes: '#7a9a8a',
  haishin: '#8a7a9a',
} as const

export const typography = {
  serif: 'CormorantGaramond_500Medium_Italic',
  sans: 'NotoSansJP_300Light',
  sansRegular: 'NotoSansJP_400Regular',
} as const

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  full: 999,
} as const
```

- [ ] **Step 2: data/mock.ts を作成**

```typescript
// data/mock.ts
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
```

- [ ] **Step 3: 型チェック**

```bash
cd /Users/tasakiryo/livelog && npx tsc --noEmit
```

期待: エラーなし（または app/ ファイル未作成によるモジュール解決エラーのみ）

- [ ] **Step 4: コミット**

```bash
git add constants/theme.ts data/mock.ts
git commit -m "feat: テーマ定数・モックデータを追加"
```

---

## Task 3: ルートレイアウト (app/_layout.tsx)

**Files:**
- Create: `app/_layout.tsx`

- [ ] **Step 1: app/_layout.tsx を作成**

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router'
import { useFonts, CormorantGaramond_500Medium_Italic } from '@expo-google-fonts/cormorant-garamond'
import { NotoSansJP_300Light, NotoSansJP_400Regular } from '@expo-google-fonts/noto-sans-jp'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    CormorantGaramond_500Medium_Italic,
    NotoSansJP_300Light,
    NotoSansJP_400Regular,
  })

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="live/[id]" />
        <Stack.Screen name="live/new" />
        <Stack.Screen name="artist/[id]" />
      </Stack>
    </>
  )
}
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add app/_layout.tsx
git commit -m "feat: ルートレイアウト・フォント読み込みを追加"
```

---

## Task 4: TypeBadge コンポーネント

**Files:**
- Create: `components/TypeBadge.tsx`

- [ ] **Step 1: components/TypeBadge.tsx を作成**

```typescript
// components/TypeBadge.tsx
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, typography } from '../constants/theme'
import type { LiveType } from '../data/mock'

const LABELS: Record<LiveType, string> = {
  wanman: 'ワンマン',
  taiban: '対バン',
  fes: 'フェス',
  haishin: '配信',
}

export function TypeBadge({ type }: { type: LiveType }) {
  const color = colors[type]
  return (
    <View style={[styles.badge, { backgroundColor: color + '33' }]}>
      <Text style={[styles.text, { color }]}>{LABELS[type]}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.sansRegular,
    fontSize: 11,
  },
})
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add components/TypeBadge.tsx
git commit -m "feat: TypeBadgeコンポーネントを追加"
```

---

## Task 5: Tag コンポーネント

**Files:**
- Create: `components/Tag.tsx`

- [ ] **Step 1: components/Tag.tsx を作成**

```typescript
// components/Tag.tsx
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, typography } from '../constants/theme'

interface TagProps {
  label: string
  accent?: boolean
}

export function Tag({ label, accent = false }: TagProps) {
  return (
    <View style={[styles.tag, accent && styles.accentTag]}>
      <Text style={[styles.text, accent && styles.accentText]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border2,
    alignSelf: 'flex-start',
  },
  accentTag: {
    borderColor: colors.accent2,
    backgroundColor: colors.accentPale,
  },
  text: {
    fontFamily: typography.sans,
    fontSize: 11,
    color: colors.text3,
  },
  accentText: {
    color: colors.accent,
  },
})
```

- [ ] **Step 2: コミット**

```bash
git add components/Tag.tsx
git commit -m "feat: Tagコンポーネントを追加"
```

---

## Task 6: FriendDots コンポーネント

**Files:**
- Create: `components/FriendDots.tsx`

- [ ] **Step 1: components/FriendDots.tsx を作成**

```typescript
// components/FriendDots.tsx
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, typography } from '../constants/theme'

export function FriendDots({ initials }: { initials: string[] }) {
  if (initials.length === 0) return null
  return (
    <View style={styles.row}>
      {initials.map((initial, i) => (
        <View key={i} style={[styles.dot, { marginLeft: i === 0 ? 0 : -4 }]}>
          <Text style={styles.text}>{initial}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: typography.sansRegular,
    fontSize: 10,
    color: colors.text2,
  },
})
```

- [ ] **Step 2: コミット**

```bash
git add components/FriendDots.tsx
git commit -m "feat: FriendDotsコンポーネントを追加"
```

---

## Task 7: LiveCard コンポーネント

**Files:**
- Create: `components/LiveCard.tsx`

- [ ] **Step 1: components/LiveCard.tsx を作成**

```typescript
// components/LiveCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, radius, typography } from '../constants/theme'
import { TypeBadge } from './TypeBadge'
import { Tag } from './Tag'
import { FriendDots } from './FriendDots'
import type { LiveType } from '../data/mock'

interface LiveCardProps {
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
  onPress: () => void
}

export function LiveCard({
  title, artists, date, venue, type,
  hasSetlist, attendCount, friends,
  flyerEmoji, accentColor, onPress,
}: LiveCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <View style={styles.card}>
        <View style={[styles.accentLine, { backgroundColor: accentColor }]} />
        <View style={styles.inner}>
          <View style={styles.flyer}>
            <Text style={styles.flyerEmoji}>{flyerEmoji}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.artists} numberOfLines={1}>{artists.join(', ')}</Text>
            <Text style={styles.venue}>📍 {venue}</Text>
            <View style={styles.row}>
              <Text style={styles.date}>{date}</Text>
              <TypeBadge type={type} />
            </View>
            <View style={styles.tagsRow}>
              {hasSetlist && <Tag label="SETLIST" accent />}
              <Tag label={`${attendCount}回目`} />
              <FriendDots initials={friends} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  accentLine: { width: 3 },
  inner: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  flyer: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flyerEmoji: { fontSize: 24 },
  content: { flex: 1, gap: 4 },
  title: {
    fontFamily: typography.serif,
    fontSize: 17,
    color: colors.text1,
  },
  artists: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.text2,
  },
  venue: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.text3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.text2,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 2,
  },
})
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add components/LiveCard.tsx
git commit -m "feat: LiveCardコンポーネントを追加"
```

---

## Task 8: SongRow コンポーネント

**Files:**
- Create: `components/SongRow.tsx`

- [ ] **Step 1: components/SongRow.tsx を作成**

```typescript
// components/SongRow.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, typography } from '../constants/theme'

interface SongRowProps {
  order: number
  title: string
  note: string
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function SongRow({ order, title, note, isFavorite, onToggleFavorite }: SongRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.order}>{order}</Text>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>
      <TouchableOpacity onPress={onToggleFavorite}>
        <Text style={styles.fav}>{isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
      <Text style={styles.handle}>⠿</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  order: {
    fontFamily: typography.serif,
    fontSize: 18,
    color: colors.text3,
    width: 24,
    textAlign: 'right',
  },
  info: { flex: 1 },
  title: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.text1,
  },
  note: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.text3,
    marginTop: 2,
  },
  fav: { fontSize: 18, color: colors.accent },
  handle: { fontSize: 16, color: colors.text3 },
})
```

- [ ] **Step 2: コミット**

```bash
git add components/SongRow.tsx
git commit -m "feat: SongRowコンポーネントを追加"
```

---

## Task 9: AddSongModal コンポーネント

**Files:**
- Create: `components/AddSongModal.tsx`

- [ ] **Step 1: components/AddSongModal.tsx を作成**

```typescript
// components/AddSongModal.tsx
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native'
import { useState } from 'react'
import { colors, radius, typography } from '../constants/theme'

const MOCK_SONGS = ['愛なくて', '三原色', '飛行艇', '白日', '無窮窓', 'Slumberland', '残夢']

interface AddSongModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (title: string) => void
}

export function AddSongModal({ visible, onClose, onAdd }: AddSongModalProps) {
  const [query, setQuery] = useState('')

  const candidates = MOCK_SONGS
    .filter((s) => (query.length > 0 ? s.includes(query) : true))
    .sort((a, b) => a.localeCompare(b, 'ja'))

  const handleAdd = (title: string) => {
    onAdd(title)
    setQuery('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>曲を追加</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="曲名を入力..."
            placeholderTextColor={colors.text3}
            autoFocus
          />
          <FlatList
            data={candidates}
            keyExtractor={(item) => item}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.candidate} onPress={() => handleAdd(item)}>
                <Text style={styles.candidateText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          {query.length > 0 && !MOCK_SONGS.includes(query) && (
            <TouchableOpacity style={styles.addCustom} onPress={() => handleAdd(query)}>
              <Text style={styles.addCustomText}>「{query}」を追加</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    maxHeight: '70%',
  },
  heading: {
    fontFamily: typography.sansRegular,
    fontSize: 16,
    color: colors.text1,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.bg3,
    borderRadius: radius.md,
    padding: 12,
    color: colors.text1,
    fontFamily: typography.sans,
    fontSize: 14,
    marginBottom: 8,
  },
  list: { maxHeight: 200 },
  candidate: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  candidateText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.text1,
  },
  addCustom: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  addCustomText: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.accent,
  },
  closeBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.text2,
  },
})
```

- [ ] **Step 2: コミット**

```bash
git add components/AddSongModal.tsx
git commit -m "feat: AddSongModalコンポーネントを追加"
```

---

## Task 10: ArtistRow コンポーネント

**Files:**
- Create: `components/ArtistRow.tsx`

- [ ] **Step 1: components/ArtistRow.tsx を作成**

```typescript
// components/ArtistRow.tsx
import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, typography } from '../constants/theme'

interface ArtistRowProps {
  rank: number
  name: string
  genre: string
  count: number
  maxCount: number
  status: 'seen' | 'wishlist'
  emoji: string
}

export function ArtistRow({ rank, name, genre, count, maxCount, status, emoji }: ArtistRowProps) {
  const isWishlist = status === 'wishlist'
  const barPercent = maxCount > 0 ? (count / maxCount) * 100 : 0

  return (
    <View style={[styles.row, isWishlist && styles.wishlistRow]}>
      <Text style={[styles.rank, isWishlist && styles.dimText]}>
        {isWishlist ? '🎯' : String(rank)}
      </Text>
      <View style={styles.icon}>
        <Text style={styles.iconEmoji}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, isWishlist && styles.dimText]}>{name}</Text>
        <Text style={styles.genre}>{genre}</Text>
        {!isWishlist && (
          <View style={styles.barContainer}>
            <View style={[styles.bar, { width: `${barPercent}%` }]} />
          </View>
        )}
        {isWishlist && (
          <Text style={styles.wishlistLabel}>まだ行ってない</Text>
        )}
      </View>
      {!isWishlist && (
        <Text style={styles.count}>{count}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  wishlistRow: { opacity: 0.7 },
  rank: {
    fontFamily: typography.serif,
    fontSize: 20,
    color: colors.text2,
    width: 28,
    textAlign: 'center',
  },
  dimText: { color: colors.text3 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 20 },
  info: { flex: 1, gap: 3 },
  name: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.text1,
  },
  genre: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.text3,
  },
  barContainer: {
    height: 3,
    backgroundColor: colors.bg3,
    borderRadius: radius.full,
    marginTop: 2,
    overflow: 'hidden',
  },
  bar: {
    height: 3,
    backgroundColor: colors.accent2,
    borderRadius: radius.full,
  },
  count: {
    fontFamily: typography.serif,
    fontSize: 20,
    color: colors.text1,
  },
  wishlistLabel: {
    fontFamily: typography.sans,
    fontSize: 11,
    color: colors.accent,
  },
})
```

- [ ] **Step 2: コミット**

```bash
git add components/ArtistRow.tsx
git commit -m "feat: ArtistRowコンポーネントを追加"
```

---

## Task 11: FilterChips コンポーネント

**Files:**
- Create: `components/FilterChips.tsx`

- [ ] **Step 1: components/FilterChips.tsx を作成**

```typescript
// components/FilterChips.tsx
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors, radius, typography } from '../constants/theme'

interface FilterChipsProps {
  options: string[]
  selected: string
  onSelect: (option: string) => void
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={[styles.chip, selected === option && styles.chipSelected]}
        >
          <Text style={[styles.text, selected === option && styles.textSelected]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.bg2,
  },
  chipSelected: {
    backgroundColor: colors.accentPale,
    borderColor: colors.accent2,
  },
  text: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text2,
  },
  textSelected: { color: colors.accent },
})
```

- [ ] **Step 2: 型チェック**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: コミット**

```bash
git add components/FilterChips.tsx
git commit -m "feat: FilterChipsコンポーネントを追加"
```

---

## Task 12: auth/login.tsx

**Files:**
- Create: `app/auth/login.tsx`

- [ ] **Step 1: app/auth/login.tsx を作成**

```typescript
// app/auth/login.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { colors, radius, typography } from '../../constants/theme'

export default function Login() {
  const handleLogin = () => router.replace('/(tabs)/timeline')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>livelog</Text>
        <Text style={styles.tagline}>your shows. your memory.</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.appleBtn]} onPress={handleLogin}>
          <Text style={[styles.btnText, styles.appleBtnText]}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontFamily: typography.serif,
    fontSize: 52,
    color: colors.text1,
  },
  tagline: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.text3,
    letterSpacing: 1,
  },
  buttons: {
    paddingHorizontal: 24,
    gap: 12,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  appleBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border2,
  },
  btnText: {
    fontFamily: typography.sansRegular,
    fontSize: 15,
    color: colors.bg,
  },
  appleBtnText: { color: colors.text1 },
})
```

- [ ] **Step 2: app/_layout.tsx に初期ルートを設定**

`app/_layout.tsx` の Stack に initialRouteName を追加し、ログイン画面から始まるようにする:

```typescript
// app/_layout.tsx の Stack を以下に変更
<Stack screenOptions={{ headerShown: false }} initialRouteName="auth/login">
  <Stack.Screen name="auth/login" />
  <Stack.Screen name="(tabs)" />
  <Stack.Screen name="live/[id]" />
  <Stack.Screen name="live/new" />
  <Stack.Screen name="artist/[id]" />
</Stack>
```

- [ ] **Step 3: コミット**

```bash
git add app/auth/login.tsx app/_layout.tsx
git commit -m "feat: ログイン画面を追加"
```

---

## Task 13: タブレイアウト & timeline.tsx

**Files:**
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/timeline.tsx`

- [ ] **Step 1: app/(tabs)/_layout.tsx を作成**

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { colors, typography } from '../../constants/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg2,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text3,
        tabBarLabelStyle: {
          fontFamily: typography.sans,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen name="timeline" options={{ title: 'shows' }} />
      <Tabs.Screen name="artists" options={{ title: 'artists' }} />
    </Tabs>
  )
}
```

- [ ] **Step 2: app/(tabs)/timeline.tsx を作成**

```typescript
// app/(tabs)/timeline.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { mockLives } from '../../data/mock'
import { LiveCard } from '../../components/LiveCard'
import { colors, typography, radius } from '../../constants/theme'

export default function Timeline() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>2025 · {mockLives.length} shows</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/live/new')}>
          <Text style={styles.addBtnText}>+ add show</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockLives}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LiveCard
            {...item}
            onPress={() => router.push(`/live/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: colors.accent2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  addBtnText: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.accent,
  },
  list: { paddingVertical: 8 },
})
```

- [ ] **Step 3: 型チェック & 動作確認**

```bash
npx tsc --noEmit
npx expo start
```

Expo Go でタイムライン画面・ライブカードが表示されることを確認する。

- [ ] **Step 4: コミット**

```bash
git add app/\(tabs\)/_layout.tsx app/\(tabs\)/timeline.tsx
git commit -m "feat: タブレイアウト・タイムライン画面を追加"
```

---

## Task 14: live/[id].tsx

**Files:**
- Create: `app/live/[id].tsx`

- [ ] **Step 1: app/live/[id].tsx を作成**

```typescript
// app/live/[id].tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useState } from 'react'
import { mockLives, mockSetlist } from '../../data/mock'
import type { MockSong } from '../../data/mock'
import { SongRow } from '../../components/SongRow'
import { TypeBadge } from '../../components/TypeBadge'
import { AddSongModal } from '../../components/AddSongModal'
import { colors, typography } from '../../constants/theme'

export default function LiveDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const live = mockLives.find((l) => l.id === id)
  const [songs, setSongs] = useState<MockSong[]>(mockSetlist)
  const [modalVisible, setModalVisible] = useState(false)

  if (!live) return null

  const toggleFavorite = (songId: string) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s))
    )
  }

  const addSong = (title: string) => {
    setSongs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        order: prev.length + 1,
        title,
        note: '',
        isFavorite: false,
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{live.title}</Text>
        <Text style={styles.meta}>{live.artists.join(', ')} · {live.date}</Text>
        <Text style={styles.venue}>📍 {live.venue}</Text>
        <TypeBadge type={live.type} />
      </View>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongRow
            order={item.order}
            title={item.title}
            note={item.note}
            isFavorite={item.isFavorite}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addSongBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addSongText}>+ 曲を追加</Text>
          </TouchableOpacity>
        }
      />
      <AddSongModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addSong}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    padding: 16,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
    marginBottom: 8,
  },
  title: {
    fontFamily: typography.serif,
    fontSize: 26,
    color: colors.text1,
  },
  meta: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text2,
  },
  venue: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
  },
  addSongBtn: {
    padding: 20,
    alignItems: 'center',
  },
  addSongText: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.accent,
  },
})
```

- [ ] **Step 2: コミット**

```bash
git add app/live/\[id\].tsx
git commit -m "feat: ライブ詳細・セットリスト画面を追加"
```

---

## Task 15: live/new.tsx

**Files:**
- Create: `app/live/new.tsx`

- [ ] **Step 1: app/live/new.tsx を作成**

```typescript
// app/live/new.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { colors, radius, typography } from '../../constants/theme'
import type { LiveType } from '../../data/mock'

const TYPE_OPTIONS: { type: LiveType; label: string }[] = [
  { type: 'wanman', label: 'ワンマン' },
  { type: 'taiban', label: '対バン' },
  { type: 'fes', label: 'フェス' },
  { type: 'haishin', label: '配信' },
]

export default function NewLive() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [type, setType] = useState<LiveType>('wanman')
  const [flyerUri, setFlyerUri] = useState<string | null>(null)

  const pickFlyer = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (!result.canceled) setFlyerUri(result.assets[0].uri)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>add show</Text>

        <Text style={styles.label}>ライブ名</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="タイトル"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>出演アーティスト</Text>
        <TextInput
          style={styles.input}
          value={artist}
          onChangeText={setArtist}
          placeholder="アーティスト名"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>日付</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY.MM.DD"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>会場</Text>
        <TextInput
          style={styles.input}
          value={venue}
          onChangeText={setVenue}
          placeholder="会場名"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>形式</Text>
        <View style={styles.typeRow}>
          {TYPE_OPTIONS.map(({ type: t, label }) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                { borderColor: colors[t] },
                type === t && styles.typeBtnSelected,
              ]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeBtnText, type === t && { color: colors[t] }]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>フライヤー画像</Text>
        <TouchableOpacity style={styles.flyerPicker} onPress={pickFlyer}>
          <Text style={styles.flyerPickerText}>
            {flyerUri ? '✓ 画像選択済み' : '+ 画像を選ぶ'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>save show</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  back: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
    marginBottom: 8,
  },
  heading: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.text1,
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.text3,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    padding: 12,
    color: colors.text1,
    fontFamily: typography.sans,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  typeBtnSelected: { backgroundColor: colors.accentPale },
  typeBtnText: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
  },
  flyerPicker: {
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  flyerPickerText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.accent,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: {
    fontFamily: typography.sansRegular,
    fontSize: 15,
    color: colors.bg,
  },
})
```

- [ ] **Step 2: コミット**

```bash
git add app/live/new.tsx
git commit -m "feat: ライブ新規登録フォームを追加"
```

---

## Task 16: artists.tsx

**Files:**
- Create: `app/(tabs)/artists.tsx`

- [ ] **Step 1: app/(tabs)/artists.tsx を作成**

```typescript
// app/(tabs)/artists.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { mockArtists } from '../../data/mock'
import { ArtistRow } from '../../components/ArtistRow'
import { FilterChips } from '../../components/FilterChips'
import { colors, typography, radius } from '../../constants/theme'

const FILTERS = ['すべて', '観覧済み', 'まだ行ってない']

export default function Artists() {
  const [filter, setFilter] = useState('すべて')

  const seen = mockArtists.filter((a) => a.status === 'seen')
  const maxCount = Math.max(...seen.map((a) => a.count), 1)

  const filtered = filter === '観覧済み'
    ? mockArtists.filter((a) => a.status === 'seen')
    : filter === 'まだ行ってない'
    ? mockArtists.filter((a) => a.status === 'wishlist')
    : mockArtists

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>artists</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ add artist</Text>
        </TouchableOpacity>
      </View>
      <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ArtistRow
            rank={index + 1}
            name={item.name}
            genre={item.genre}
            count={item.count}
            maxCount={maxCount}
            status={item.status}
            emoji={item.emoji}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  heading: {
    fontFamily: typography.serif,
    fontSize: 26,
    color: colors.text1,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: colors.accent2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  addBtnText: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.accent,
  },
})
```

- [ ] **Step 2: コミット**

```bash
git add app/\(tabs\)/artists.tsx
git commit -m "feat: アーティスト一覧画面を追加"
```

---

## Task 17: artist/[id].tsx

**Files:**
- Create: `app/artist/[id].tsx`

- [ ] **Step 1: app/artist/[id].tsx を作成**

```typescript
// app/artist/[id].tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { mockArtists, mockLives } from '../../data/mock'
import { LiveCard } from '../../components/LiveCard'
import { colors, typography } from '../../constants/theme'

export default function ArtistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const artist = mockArtists.find((a) => a.id === id)
  const artistLives = mockLives.filter((l) =>
    artist ? l.artists.includes(artist.name) : false
  )

  if (!artist) return null

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{artist.emoji}</Text>
        <Text style={styles.name}>{artist.name}</Text>
        <Text style={styles.genre}>{artist.genre} · {artist.count}回観覧</Text>
      </View>
      <FlatList
        data={artistLives}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LiveCard
            {...item}
            onPress={() => router.push(`/live/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>観覧したライブの記録はありません</Text>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    padding: 16,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
    marginBottom: 8,
  },
  emoji: { fontSize: 36 },
  name: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.text1,
  },
  genre: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
  },
  list: { paddingVertical: 8 },
  empty: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
    textAlign: 'center',
    paddingTop: 40,
  },
})
```

- [ ] **Step 2: 全体型チェック**

```bash
npx tsc --noEmit
```

期待: エラーなし

- [ ] **Step 3: コミット**

```bash
git add app/artist/\[id\].tsx
git commit -m "feat: アーティスト詳細画面を追加"
```

---

## Task 18: Expo Go 動作確認

- [ ] **Step 1: 開発サーバー起動**

```bash
cd /Users/tasakiryo/livelog
npx expo start
```

- [ ] **Step 2: 以下の動線を確認する**

| 確認項目 | 期待動作 |
|---|---|
| ログイン画面 | ロゴ・キャッチコピー・ボタンが表示される |
| ログインボタンタップ | タイムライン画面に遷移する |
| タイムライン | 3件のライブカードが表示される（アクセントライン・バッジ・タグ） |
| `+ add show` タップ | 新規登録フォームに遷移する |
| カードタップ | ライブ詳細・セットリスト画面に遷移する |
| `+ 曲を追加` | モーダルが開き、候補から曲を追加できる |
| ♡ タップ | お気に入りが切り替わる |
| artists タブ | アーティスト一覧がランキング表示される |
| フィルター切り替え | 表示が絞り込まれる |

- [ ] **Step 3: 問題があれば修正してコミット**

```bash
git add -p
git commit -m "fix: Expo Go動作確認で判明した表示修正"
```

- [ ] **Step 4: 最終コミット**

```bash
git log --oneline
```

全タスクのコミットが揃っていることを確認する。
