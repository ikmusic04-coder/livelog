// app/live/new.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { colors, radius, typography } from '../../constants/theme'
import type { LiveType } from '../../data/mock'

const TYPE_OPTIONS: { type: LiveType; label: string }[] = [
  { type: 'wanman', label: 'ワンマン' },
  { type: 'taiban', label: '対バン' },
  { type: 'fes', label: 'フェス' },
  { type: 'haishin', label: '配信' },
]

export default function NewLive() {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [type, setType] = useState<LiveType>('wanman')
  const [flyerUri, setFlyerUri] = useState<string | null>(null)

  const pickFlyer = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (!result.canceled) setFlyerUri(result.assets[0].uri)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>add show</Text>

        <Text style={styles.label}>ライブ名</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="タイトル"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>出演アーティスト</Text>
        <TextInput
          style={styles.input}
          value={artist}
          onChangeText={setArtist}
          placeholder="アーティスト名"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>日付</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY.MM.DD"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>会場</Text>
        <TextInput
          style={styles.input}
          value={venue}
          onChangeText={setVenue}
          placeholder="会場名"
          placeholderTextColor={colors.text3}
        />

        <Text style={styles.label}>形式</Text>
        <View style={styles.typeRow}>
          {TYPE_OPTIONS.map(({ type: t, label }) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                { borderColor: colors[t] },
                type === t && styles.typeBtnSelected,
              ]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.typeBtnText, type === t && { color: colors[t] }]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>フライヤー画像</Text>
        <TouchableOpacity style={styles.flyerPicker} onPress={pickFlyer}>
          <Text style={styles.flyerPickerText}>
            {flyerUri ? '✓ 画像選択済み' : '+ 画像を選ぶ'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>save show</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  back: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
    marginBottom: 8,
  },
  heading: {
    fontFamily: typography.serif,
    fontSize: 28,
    color: colors.text1,
    marginBottom: 16,
  },
  label: {
    fontFamily: typography.sans,
    fontSize: 12,
    color: colors.text3,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    padding: 12,
    color: colors.text1,
    fontFamily: typography.sans,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  typeBtnSelected: { backgroundColor: colors.accentPale },
  typeBtnText: {
    fontFamily: typography.sans,
    fontSize: 13,
    color: colors.text3,
  },
  flyerPicker: {
    backgroundColor: colors.bg2,
    borderRadius: radius.md,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  flyerPickerText: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.accent,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: {
    fontFamily: typography.sansRegular,
    fontSize: 15,
    color: colors.bg,
  },
})
