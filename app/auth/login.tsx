// app/auth/login.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { colors, radius, typography } from '../../constants/theme'

export default function Login() {
  const handleLogin = () => router.replace('/(tabs)/timeline')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>livelog</Text>
        <Text style={styles.tagline}>your shows. your memory.</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.appleBtn]} onPress={handleLogin}>
          <Text style={[styles.btnText, styles.appleBtnText]}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontFamily: typography.serif,
    fontSize: 52,
    color: colors.text1,
  },
  tagline: {
    fontFamily: typography.sans,
    fontSize: 14,
    color: colors.text3,
    letterSpacing: 1,
  },
  buttons: {
    paddingHorizontal: 24,
    gap: 12,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  appleBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border2,
  },
  btnText: {
    fontFamily: typography.sansRegular,
    fontSize: 15,
    color: colors.bg,
  },
  appleBtnText: { color: colors.text1 },
})
