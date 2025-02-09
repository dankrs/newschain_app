import { Stack } from 'expo-router';
import { COLORS } from '@/constants';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { usePathname } from 'expo-router';

export default function AuthLayout() {
  const pathname = usePathname();

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Prevent back navigation on these screens
      if (pathname === '/(auth)/login' || 
          pathname === '/(auth)/welcome' || 
          pathname === '/(auth)/verify-email') {
        return true; // Prevents default back behavior
      }
      return false; // Allows default back behavior
    });

    return () => backHandler.remove();
  }, [pathname]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        gestureEnabled: false,
        headerBackVisible: false,
        // Prevent multiple taps
        freezeOnBlur: true,
      }}
      initialRouteName="welcome"
    >
      <Stack.Screen 
        name="welcome" 
        options={{
          gestureEnabled: false,
          headerBackVisible: false,
          animation: 'none',
          headerLeft: () => null,
          // Prevent going back to this screen
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          gestureEnabled: false,
          headerBackVisible: false,
          animation: 'none',
          headerLeft: () => null,
          // Prevent going back to this screen
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen 
        name="register"
        options={{
          gestureEnabled: true,
          headerBackVisible: true,
          // Allow animation when going back to login
          animation: 'slide_from_left',
        }}
      />
      <Stack.Screen 
        name="verify-email"
        options={{
          gestureEnabled: false,
          headerBackVisible: false,
          animation: 'none',
          headerLeft: () => null,
          // Prevent going back to registration
          navigationBarHidden: true,
        }}
      />
    </Stack>
  );
} 