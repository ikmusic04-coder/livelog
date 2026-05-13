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
