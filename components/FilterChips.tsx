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
