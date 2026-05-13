// app/_layout.tsx
import { Stack } from 'expo-router'
import { useFonts, CormorantGaramond_500Medium_Italic } from '@expo-google-fonts/cormorant-garamond'
import { NotoSansJP_300Light, NotoSansJP_400Regular } from '@expo-google-fonts/noto-sans-jp'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    CormorantGaramond_500Medium_Italic,
    NotoSansJP_300Light,
    NotoSansJP_400Regular,
  })

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} initialRouteName="auth/login">
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="live/[id]" />
        <Stack.Screen name="live/new" />
        <Stack.Screen name="artist/[id]" />
      </Stack>
    </>
  )
}
