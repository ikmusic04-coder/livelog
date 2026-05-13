// app/(tabs)/artists.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { router } from 'expo-router'
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
          <TouchableOpacity onPress={() => router.push(`/artist/${item.id}`)}>
            <ArtistRow
              rank={index + 1}
              name={item.name}
              genre={item.genre}
              count={item.count}
              maxCount={maxCount}
              status={item.status}
              emoji={item.emoji}
            />
          </TouchableOpacity>
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
