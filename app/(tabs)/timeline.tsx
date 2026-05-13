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
