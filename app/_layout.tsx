import { Stack } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { COLORS } from '@/constants';

// Ignore specific warnings
LogBox.ignoreLogs([
  "Warning: Failed prop type",
  "Non-serializable values were found in the navigation state",
]);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.white,
    text: COLORS.text,
    border: COLORS.gray,
    notification: COLORS.primary,
  },
};

export default function RootLayout() {
  useEffect(() => {
    // Add any root-level initialization here
  }, []);

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(app)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
