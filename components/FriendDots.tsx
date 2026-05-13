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
