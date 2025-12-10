import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const nav = useNavigation();
  useEffect(() => {
    const t = setTimeout(() => nav.navigate('Onboarding' as any), 1200);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>Smart Expense</Text>
      <ActivityIndicator style={{ marginTop: 20 }} />
    </View>
  );
}
