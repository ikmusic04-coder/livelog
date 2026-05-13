// app/artist/[id].tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { mockArtists, mockLives } from '../../data/mock'
import { LiveCard } from '../../components/LiveCard'
import { colors, typography } from '../../constants/theme'

export default function ArtistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const artist = mockArtists.find((a) => a.id === id)
  const artistLives = mockLives.filter((l) =>
    artist ? l.artists.includes(artist.name) : false
  )

  if (!artist) return null

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.emoji}>{artist.emoji}</Text>
        <Text style={styles.name}>{artist.name}</Text>
        <Text style={styles.genre}>{artist.genre} · {artist.count}回観覧</Text>
      </View>
      <FlatList
        data={artistLives}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LiveCard
            {...item}
            onPress={() => router.push(`/live/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>観覧したライブの記録はありません</Text>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    padding: 16,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
    marginBottom: 8,
  },
  emoji: { fontSize: 36 },
  name: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.text1,
  },
  genre: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
  },
  list: { paddingVertical: 8 },
  empty: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
    textAlign: 'center',
    paddingTop: 40,
  },
})
