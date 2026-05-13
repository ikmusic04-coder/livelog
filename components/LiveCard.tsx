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
