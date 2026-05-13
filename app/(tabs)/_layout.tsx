// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { colors, typography } from '../../constants/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg2,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text3,
        tabBarLabelStyle: {
          fontFamily: typography.sans,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen name="timeline" options={{ title: 'shows' }} />
      <Tabs.Screen name="artists" options={{ title: 'artists' }} />
    </Tabs>
  )
}
