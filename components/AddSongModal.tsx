// components/AddSongModal.tsx
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native'
import { useState } from 'react'
import { colors, radius, typography } from '../constants/theme'

const MOCK_SONGS = ['愛なくて', '三原色', '飛行艇', '白日', '無窮窓', 'Slumberland', '残夢']

interface AddSongModalProps {
  visible: boolean
  onClose: () => void
  onAdd: (title: string) => void
}

export function AddSongModal({ visible, onClose, onAdd }: AddSongModalProps) {
  const [query, setQuery] = useState('')

  const candidates = MOCK_SONGS
    .filter((s) => (query.length > 0 ? s.includes(query) : true))
    .sort((a, b) => a.localeCompare(b, 'ja'))

  const handleAdd = (title: string) => {
    onAdd(title)
    setQuery('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.heading}>曲を追加</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="曲名を入力..."
            placeholderTextColor={colors.text3}
            autoFocus
          />
          <FlatList
            data={candidates}
            keyExtractor={(item) => item}
            style={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.candidate} onPress={() => handleAdd(item)}>
                <Text style={styles.candidateText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          {query.length > 0 && !MOCK_SONGS.includes(query) && (
            <TouchableOpacity style={styles.addCustom} onPress={() => handleAdd(query)}>
              <Text style={styles.addCustomText}>「{query}」を追加</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: colors.bg2,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 20,
    maxHeight: '70%',
  },
  heading: {
    fontFamily: typography.sansRegular,
    fontSize: 16,
    color: colors.text1,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.bg3,
    borderRadius: radius.md,
    padding: 12,
    color: colors.text1,
    fontFamily: typography.sans,
    fontSize: 14,
    marginBottom: 8,
  },
  list: { maxHeight: 200 },
  candidate: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  candidateText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.text1,
  },
  addCustom: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  addCustomText: {
    fontFamily: typography.sansRegular,
    fontSize: 14,
    color: colors.accent,
  },
  closeBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.text2,
  },
})
