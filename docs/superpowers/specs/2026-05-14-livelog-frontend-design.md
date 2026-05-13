# LIVELOG フロントエンド設計ドキュメント

**作成日**: 2026-05-14  
**ステータス**: 承認済み

---

## 概要

音楽好き向けのライブ記録アプリ「LIVELOG」のフロントエンドを構築する。  
バックエンド（Supabase）接続は後フェーズ。現フェーズはモックデータで動作する状態を完成させ、Expo Goで実機確認する。

---

## 技術スタック

| 項目 | 選定 |
|---|---|
| フレームワーク | React Native + Expo (TypeScript) |
| ナビゲーション | Expo Router v3（ファイルベース） |
| スタイリング | StyleSheet（React Native標準） |
| フォント | Expo Google Fonts（Cormorant Garamond + Noto Sans JP） |
| 画像選択 | expo-image-picker |
| バックエンド | なし（モックデータのみ） |

---

## プロジェクト構成

```
livelog/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # タブレイアウト（2タブ）
│   │   ├── timeline.tsx       # タブ1: タイムライン
│   │   └── artists.tsx        # タブ2: アーティスト記録
│   ├── live/
│   │   ├── [id].tsx           # ライブ詳細・セットリスト
│   │   └── new.tsx            # 新規登録フォーム
│   ├── artist/
│   │   └── [id].tsx           # アーティスト詳細
│   ├── auth/
│   │   └── login.tsx          # ログイン画面（モック）
│   └── _layout.tsx            # ルートレイアウト
├── components/
│   ├── LiveCard.tsx           # タイムラインカード
│   ├── ArtistRow.tsx          # アーティスト一覧行
│   ├── SongRow.tsx            # セットリスト曲行
│   ├── TypeBadge.tsx          # 形式バッジ（ワンマン等）
│   ├── Tag.tsx                # タグ（セットリストあり等）
│   ├── FriendDots.tsx         # 友人イニシャルアイコン
│   ├── AddSongModal.tsx       # 曲追加モーダル
│   └── FilterChips.tsx        # フィルターチップ
├── constants/
│   └── theme.ts               # カラー・タイポ・radius
└── data/
    └── mock.ts                # モックデータ一元管理
```

---

## デザイントークン

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
}

export const typography = {
  serif: 'CormorantGaramond_500Medium_Italic',
  sans: 'NotoSansJP_300Light',
  sansRegular: 'NotoSansJP_400Regular',
}

export const radius = { sm: 6, md: 10, lg: 14, full: 999 }
```

---

## 画面一覧

### auth/login.tsx
- ロゴ `livelog`（Cormorant Garamond・イタリック・大きめ）
- キャッチコピー小テキスト（例: `your shows. your memory.`）
- `Continue with Google` ボタン
- `Continue with Apple` ボタン
- モック: タップでタイムラインへ遷移

### (tabs)/timeline.tsx
- ヘッダー左: `2025 · 12 shows`
- ヘッダー右: `+ add show` ボタン → `live/new` へ遷移
- FlatList でライブカード一覧
- カードタップ → `live/[id]` へ遷移

### live/new.tsx
- 入力項目: ライブ名・出演アーティスト（複数可）・日付・会場・形式（選択ボタン）・フライヤー画像
- 入力タイミングで既存ライブ候補を表示（モック動作）
- `save show` ボタン（ラベンダー色・フルワイド）

### live/[id].tsx
- ヘッダー: 戻るボタン・ライブ名・アーティスト・日付・会場・形式バッジ
- セットリスト: SongRow の FlatList（番号・タイトル・メモ・お気に入り・並び替えハンドル）
- `+ 曲を追加` → AddSongModal を開く

### (tabs)/artists.tsx
- FilterChips: `すべて` `観覧済み` `まだ行ってない`
- 観覧済みアーティスト: ランキング表示（棒グラフ付き）
- ウィッシュリスト: 点線ボーダー・opacity 0.7・🎯アイコン
- `+ add artist` ボタン

### artist/[id].tsx
- アーティスト詳細（名前・ジャンル・観覧回数）
- 観覧したライブ一覧

---

## コンポーネント責務

| コンポーネント | 責務 | 主な使用画面 |
|---|---|---|
| `LiveCard` | アクセントライン・フライヤーサムネイル・バッジ・友人ドット・タグを含むカード | timeline |
| `TypeBadge` | 形式ごとの色付きバッジ（ワンマン/対バン/フェス/配信） | LiveCard, live/[id] |
| `FriendDots` | 参加友人のイニシャル丸アイコン | LiveCard |
| `Tag` | セットリストあり/初見・再見タグ | LiveCard |
| `SongRow` | 曲番号・タイトル・メモ・お気に入りボタン・並び替えハンドル | live/[id] |
| `AddSongModal` | テキスト入力 + 50音順候補リストで曲追加 | live/[id] |
| `ArtistRow` | ランキング番号・アイコン・名前・ジャンル・棒グラフ・回数 | artists |
| `FilterChips` | 横スクロールのフィルターチップ | artists |

---

## 状態管理

- グローバルstate不使用（モックデータのみ）
- `useState` で画面内ローカル状態を管理（フォーム入力・セットリスト編集・フィルター選択）
- `data/mock.ts` にモックデータを集約し各画面からimport

---

## 実装順序

```
Phase 1: 基盤セットアップ
  - npx create-expo-app livelog --template typescript
  - 依存パッケージ導入（expo-router, expo-image-picker, google-fonts）
  - constants/theme.ts + data/mock.ts 作成

Phase 2: 共有コンポーネント
  TypeBadge → Tag → FriendDots → LiveCard
  → ArtistRow → FilterChips → SongRow → AddSongModal

Phase 3: 画面実装
  auth/login → (tabs)/timeline → live/[id] → live/new
  → (tabs)/artists → artist/[id]

Phase 4: Expo Goで実機確認 → 調整
```

---

## デプロイ戦略

| ステップ | 方法 | 費用 |
|---|---|---|
| 開発・確認 | Expo Go（QRコード） | 無料 |
| テストビルド | EAS Build 無料枠 | 無料（月30ビルドまで） |
| TestFlight配布 | Apple Developer Program | 年$99 |
| バックエンド統合 | 別フェーズ（Supabase） | - |

---

## 将来フェーズ（現フェーズ対象外）

- Supabase認証（Google/Apple Sign In）
- Supabase DB（ライブ・セットリスト・アーティスト）
- Supabase Storage（フライヤー画像）
- フレンド機能（参加記録の共有）
