import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useStore } from '../store/useStore';
import { isoNow } from '../utils/date';

const schema = Yup.object().shape({
  amount: Yup.number().required().positive(),
  type: Yup.string().oneOf(['debit', 'credit']).required(),
  category: Yup.string().optional(),
  description: Yup.string().optional(),
});

export default function AddExpenseScreen({ navigation }: any) {
  const addTransaction = useStore((s) => s.addTransaction);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Formik
        initialValues={{ amount: '', type: 'debit', category: '', description: '' }}
        validationSchema={schema}
        onSubmit={(values) => {
          addTransaction({
            amount: Number(values.amount),
            type: values.type as 'debit' | 'credit',
            date: isoNow(),
            category: values.category,
            description: values.description,
            source: 'manual',
          });
          Alert.alert('Saved', 'Transaction added');
          navigation.goBack();
        }}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <View>
            <Text>Amount</Text>
            <TextInput keyboardType="numeric" value={values.amount} onChangeText={handleChange('amount')} style={{ borderWidth: 1, padding: 8, marginVertical: 8 }} />
            {errors.amount && <Text style={{ color: 'red' }}>{errors.amount}</Text>}

            <Text>Type (debit/credit)</Text>
            <TextInput value={values.type} onChangeText={handleChange('type')} style={{ borderWidth: 1, padding: 8, marginVertical: 8 }} />

            <Text>Category</Text>
            <TextInput value={values.category} onChangeText={handleChange('category')} style={{ borderWidth: 1, padding: 8, marginVertical: 8 }} />

            <Text>Description</Text>
            <TextInput value={values.description} onChangeText={handleChange('description')} style={{ borderWidth: 1, padding: 8, marginVertical: 8 }} />

            <Button title="Save" onPress={handleSubmit as any} />
          </View>
        )}
      </Formik>
    </View>
  );
}
