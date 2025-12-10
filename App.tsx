import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation';
import { useHydrateStore } from './src/hooks/useHydrateStore';

export default function App() {
  useHydrateStore(); // hydrate zustand from AsyncStorage at app start

  return (
    <PaperProvider>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </PaperProvider>
  );
}
