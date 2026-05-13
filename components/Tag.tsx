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
