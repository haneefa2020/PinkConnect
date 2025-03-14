import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { Animated } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light';
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [colorScheme]);

  return (
    <ThemeProvider>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: Colors[colorScheme].background,
            },
            headerTintColor: Colors[colorScheme].text,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </Animated.View>
    </ThemeProvider>
  );
}
