// App.tsx
import React from 'react';
import { StatusBar, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation';
import { useHydrateStore } from './src/hooks/useHydrateStore';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from './src/theme';

export default function App() {
  useHydrateStore();

  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={[Colors.background, '#ffffff']} style={{ flex: 1 }}>
        <AppNavigator />
      </LinearGradient>
    </PaperProvider>
  );
}
