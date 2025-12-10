// src/components/BalanceCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useStore } from '../store/useStore';
import { Colors, Spacing, Shadows } from '../theme';

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
    <LinearGradient
      colors={[Colors.primary, Colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        margin: Spacing.md,
        padding: Spacing.lg,
        borderRadius: 14,
        ...Shadows.card,
      }}
    >
      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Total Balance</Text>
      <Text style={{ color: '#fff', fontSize: 34, fontWeight: '700', marginTop: 6 }}>{balance.toFixed(2)}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8 }}>Monthly Expenses: {monthlyExpenses.toFixed(2)}</Text>
    </LinearGradient>
  );
}
