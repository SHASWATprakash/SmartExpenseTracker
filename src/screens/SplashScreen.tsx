// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

// map this screen to the correct route name in your stack
type SplashNavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const nav = useNavigation<SplashNavProp>();

  useEffect(() => {
    const t = setTimeout(() => {
      nav.navigate('Onboarding'); // no more errors!
    }, 1200);

    return () => clearTimeout(t);
  }, [nav]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Smart Expense</Text>
      <ActivityIndicator style={{ marginTop: 20 }} />
    </View>
  );
}
