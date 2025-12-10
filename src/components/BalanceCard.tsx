import React from 'react';
import { View, Text } from 'react-native';
import { useStore } from '../store/useStore';

export default function BalanceCard() {
  const transactions = useStore((s) => s.transactions);
  const balance = transactions.reduce((acc, t) => (t.type === 'credit' ? acc + t.amount : acc - t.amount), 0);
  const monthlyExpenses = transactions
    .filter((t) => {
      const txDate = new Date(t.date);
      const now = new Date();
      return txDate.getFullYear() === now.getFullYear() && txDate.getMonth() === now.getMonth();
    })
    .reduce((s, t) => s + (t.type === 'debit' ? t.amount : 0), 0);

  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 10, margin: 12, elevation: 2 }}>
      <Text style={{ color: '#666' }}>Total Balance</Text>
      <Text style={{ fontSize: 28, fontWeight: '700', marginTop: 6 }}>{balance.toFixed(2)}</Text>
      <Text style={{ color: '#999', marginTop: 8 }}>Monthly Expenses: {monthlyExpenses.toFixed(2)}</Text>
    </View>
  );
}
