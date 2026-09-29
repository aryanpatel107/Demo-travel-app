import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import 'react-native-reanimated';

// Suppress benign development warning when device has OS "Reduce Motion" enabled
LogBox.ignoreLogs(['[Reanimated] Reduced motion setting is enabled']);

import { useColorScheme } from '@/components/useColorScheme';
import { BrandConfigProvider } from '@/contexts/BrandConfigContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import BrandSplash from '@/components/brand/BrandSplash';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colorScheme = useColorScheme();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BrandConfigProvider>
        <AuthProvider>
          <ToastProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="about" options={{ title: "About", headerShown: true }} />
              <Stack.Screen name="contact" options={{ title: "Contact Us", headerShown: true }} />
              <Stack.Screen name="destinations/[id]" options={{ title: "Destination", headerShown: false }} />
              <Stack.Screen name="trips/create" options={{ title: "Plan a Trip", headerShown: false }} />
              <Stack.Screen name="trips/[id]/index" options={{ title: "Trip Itinerary", headerShown: false }} />
              <Stack.Screen name="trips/[id]/payment-success" options={{ title: "Payment Status", headerShown: false }} />
              <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
              <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
            </Stack>
            <BrandSplash />
          </ToastProvider>
        </AuthProvider>
      </BrandConfigProvider>
    </ThemeProvider>
  );
}
