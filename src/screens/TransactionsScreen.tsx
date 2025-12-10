import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useStore } from '../store/useStore';

export default function TransactionsScreen() {
  const transactions = useStore((s) => s.transactions);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={transactions}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600' }}>{item.description ?? 'Transaction'}</Text>
            <Text style={{ color: '#666' }}>{item.category ?? item.bank ?? '—'}</Text>
            <Text style={{ marginTop: 4 }}>{item.type === 'debit' ? '-' : '+'}{item.amount.toFixed(2)}</Text>
            <Text style={{ color: '#999', marginTop: 6 }}>{new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}
