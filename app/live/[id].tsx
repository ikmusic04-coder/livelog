// app/live/[id].tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useState } from 'react'
import { mockLives, mockSetlist } from '../../data/mock'
import type { MockSong } from '../../data/mock'
import { SongRow } from '../../components/SongRow'
import { TypeBadge } from '../../components/TypeBadge'
import { AddSongModal } from '../../components/AddSongModal'
import { colors, typography } from '../../constants/theme'

export default function LiveDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const live = mockLives.find((l) => l.id === id)
  const [songs, setSongs] = useState<MockSong[]>(mockSetlist)
  const [modalVisible, setModalVisible] = useState(false)

  if (!live) return null

  const toggleFavorite = (songId: string) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s))
    )
  }

  const addSong = (title: string) => {
    setSongs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        order: prev.length + 1,
        title,
        note: '',
        isFavorite: false,
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{live.title}</Text>
        <Text style={styles.meta}>{live.artists.join(', ')} · {live.date}</Text>
        <Text style={styles.venue}>📍 {live.venue}</Text>
        <TypeBadge type={live.type} />
      </View>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongRow
            order={item.order}
            title={item.title}
            note={item.note}
            isFavorite={item.isFavorite}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addSongBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addSongText}>+ 曲を追加</Text>
          </TouchableOpacity>
        }
      />
      <AddSongModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addSong}
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
  title: {
    fontFamily: typography.serif,
    fontSize: 26,
    color: colors.text1,
  },
  meta: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text2,
  },
  venue: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
  },
  addSongBtn: {
    padding: 20,
    alignItems: 'center',
  },
  addSongText: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.accent,
  },
})
