// src/screens/AddExpenseScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '../store/useStore';
import { isoNow } from '../utils/date';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';

type AddNavProp = NativeStackNavigationProp<RootStackParamList, 'AddExpense'>;

const schema = Yup.object().shape({
  amount: Yup.number().required('Amount is required').positive('Amount must be > 0'),
  type: Yup.string().oneOf(['debit', 'credit']).required('Type is required'),
  category: Yup.string().optional(),
  description: Yup.string().optional(),
});

export default function AddExpenseScreen() {
  const nav = useNavigation<AddNavProp>();
  const addTransaction = useStore((s) => s.addTransaction);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 10, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.header}>Add Expense</Text>

          <Formik
            initialValues={{ amount: '', type: 'debit', category: '', description: '' }}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
              addTransaction({
                amount: Number(values.amount),
                type: values.type as 'debit' | 'credit',
                date: isoNow(),
                category: values.category || undefined,
                description: values.description || undefined,
                source: 'manual',
              });
              resetForm();
              Alert.alert('Saved', 'Transaction added successfully', [
                { text: 'OK', onPress: () => nav.goBack() },
              ]);
            }}
          >
            {({ handleChange, handleSubmit, values, errors, touched, isValid, setFieldValue }) => (
              <View style={{ width: '100%' }}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={values.amount}
                  onChangeText={handleChange('amount')}
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  returnKeyType="next"
                />
                {touched.amount && errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

                <Text style={styles.label}>Type</Text>
                {/* Toggle / segmented control */}
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.toggleButton,
                      values.type === 'debit' ? styles.toggleActiveDebit : styles.toggleInactive,
                    ]}
                    onPress={() => setFieldValue('type', 'debit')}
                  >
                    <Text style={[styles.toggleText, values.type === 'debit' && styles.toggleTextActive]}>Debit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.toggleButton,
                      values.type === 'credit' ? styles.toggleActiveCredit : styles.toggleInactive,
                    ]}
                    onPress={() => setFieldValue('type', 'credit')}
                  >
                    <Text style={[styles.toggleText, values.type === 'credit' && styles.toggleTextActive]}>Credit</Text>
                  </TouchableOpacity>
                </View>
                {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

                <Text style={styles.label}>Category</Text>
                <TextInput
                  style={styles.input}
                  value={values.category}
                  onChangeText={handleChange('category')}
                  placeholder="Food"
                  placeholderTextColor="#999"
                  returnKeyType="next"
                />

                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={values.description}
                  onChangeText={handleChange('description')}
                  placeholder="Description"
                  placeholderTextColor="#999"
                  multiline
                  textAlignVertical="top"
                />

                <View style={styles.cta}>
                  <Button title="Save" onPress={() => handleSubmit()} disabled={!isValid || !values.amount} />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F6F7' },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  label: { marginTop: 12, marginBottom: 6, fontWeight: '600', color: '#222', alignSelf: 'flex-start' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 110,
    paddingTop: 10,
  },
  error: { color: '#D32F2F', marginTop: 6 },

  /* Toggle styles */
  toggleRow: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  toggleActiveDebit: {
    backgroundColor: '#FFF1F0', // pale red for debit
    borderWidth: 1,
    borderColor: '#F87171',
  },
  toggleActiveCredit: {
    backgroundColor: '#ECFEFF', // pale teal for credit
    borderWidth: 1,
    borderColor: '#34D399',
  },
  toggleText: {
    color: '#333',
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#111',
  },

  cta: { marginTop: 20, width: '100%' },
});
