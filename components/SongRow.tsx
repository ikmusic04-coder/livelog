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
