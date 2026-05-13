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
