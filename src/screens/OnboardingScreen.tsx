import React from 'react';
import { View, Text, Button, Platform, Alert } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { startSmsListener, stopSmsListener } from '../services/smsReader';

export default function OnboardingScreen() {
  const nav = useNavigation();
  const requestSms = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Note', 'SMS automatic parsing is only available on Android. You can add transactions manually on iOS.');
      nav.navigate('Dashboard' as any);
      return;
    }
    const res = await request(PERMISSIONS.ANDROID.READ_SMS);
    if (res === RESULTS.GRANTED) {
      startSmsListener();
      nav.navigate('Dashboard' as any);
    } else {
      Alert.alert('Permission denied', 'You can still continue and add transactions manually.');
      nav.navigate('Dashboard' as any);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 12 }}>Welcome to Smart Expense</Text>
      <Text style={{ color: '#666', marginBottom: 20 }}>
        We can auto-parse bank SMS (Android) or you can add expenses manually.
      </Text>
      <Button title="Enable SMS Parsing (Android)" onPress={requestSms} />
      <View style={{ height: 12 }} />
      <Button title="Skip" onPress={() => nav.navigate('Dashboard' as any)} />
    </View>
  );
}
