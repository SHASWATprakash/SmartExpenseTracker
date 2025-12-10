// src/screens/OnboardingScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  Alert,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { request, check, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';
import { startSmsListener, stopSmsListener } from '../services/smsReader';
import { Colors, Spacing } from '../theme';

type OnboardingNavProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

// Proper TypeScript type for permission results (RESULTS is a runtime value)
type PermissionResult = (typeof RESULTS)[keyof typeof RESULTS];

export default function OnboardingScreen() {
  const nav = useNavigation<OnboardingNavProp>();
  const [statusText, setStatusText] = useState<string | null>(null);

  useEffect(() => {
    // cleanup listener on unmount
    return () => {
      stopSmsListener();
    };
  }, []);

  const goToDashboard = () => nav.navigate('Dashboard');

  const handlePermissionResult = (res: PermissionResult) => {
    if (res === RESULTS.GRANTED) {
      setStatusText('Permission granted — listening to incoming SMS.');
      startSmsListener();
      // small delay so user sees status then navigate
      setTimeout(goToDashboard, 700);
      return;
    }
    if (res === RESULTS.DENIED) {
      setStatusText('Permission denied. You can still add transactions manually.');
      Alert.alert('Permission denied', 'You can still add transactions manually. To enable auto-import later, open app settings.');
      goToDashboard();
      return;
    }
    if (res === RESULTS.BLOCKED || res === RESULTS.UNAVAILABLE) {
      setStatusText('Permission blocked or unavailable. Open settings to enable SMS permission.');
      Alert.alert(
        'Permission blocked',
        'SMS permission is blocked. Open app settings and enable SMS permission to allow automatic import.',
        [
          { text: 'Cancel' },
          { text: 'Open Settings', onPress: () => openSettings().catch(() => Linking.openSettings()) },
        ]
      );
      return;
    }
    // fallback
    setStatusText('Permission result: ' + String(res));
  };

  const requestSms = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Note',
        'SMS automatic parsing is only available on Android. Use manual Add Expense on iOS.'
      );
      goToDashboard();
      return;
    }

    try {
      // First check current status, then request if needed
      const current = await check(PERMISSIONS.ANDROID.READ_SMS);
      // 'current' is a value matching RESULTS; cast safely to PermissionResult for TS
      handlePermissionResult(current as PermissionResult);
      if (current === RESULTS.GRANTED) {
        return;
      }

      const res = await request(PERMISSIONS.ANDROID.READ_SMS);
      handlePermissionResult(res as PermissionResult);
    } catch (err) {
      console.warn('permission request error', err);
      Alert.alert('Error', 'Failed to request SMS permission. Please try again.');
      goToDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Smart Expense</Text>
        <Text style={styles.subtitle}>
          We can automatically import your bank transaction SMS on Android so you don't have to enter expenses manually.
        </Text>

        <View style={{ height: Spacing.md }} />

        <TouchableOpacity style={styles.primary} onPress={requestSms} activeOpacity={0.85}>
          <Text style={styles.primaryText}>Enable SMS Parsing (Android)</Text>
        </TouchableOpacity>

        <View style={{ height: 12 }} />

        <TouchableOpacity style={styles.secondary} onPress={goToDashboard} activeOpacity={0.8}>
          <Text style={styles.secondaryText}>Skip for now</Text>
        </TouchableOpacity>

        {statusText ? (
          <Text style={styles.status}>{statusText}</Text>
        ) : (
          <Text style={styles.hint}>
            On Android you will be asked to allow SMS access. 
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.md, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  subtitle: { color: Colors.muted, lineHeight: 20 },
  primary: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondary: {
    marginTop: 6,
    backgroundColor: Colors.cardBg,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  secondaryText: { color: Colors.primary, fontWeight: '600' },
  hint: { marginTop: Spacing.md, color: Colors.muted },
  status: { marginTop: Spacing.md, color: Colors.primary, fontWeight: '600' },
});
