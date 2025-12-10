import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import BalanceCard from '../components/BalanceCard';
import SpendingChart from '../components/SpendingChart';
import { useStore } from '../store/useStore';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const nav = useNavigation();
  const transactions = useStore((s) => s.transactions);

  return (
    <View style={{ flex: 1 }}>
      <BalanceCard />
      <SpendingChart />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 }}>
        <Button title="Add Expense" onPress={() => nav.navigate('AddExpense' as any)} />
        <Button title="Transactions" onPress={() => nav.navigate('Transactions' as any)} />
      </View>

      <Text style={{ marginLeft: 12, marginTop: 8, fontWeight: '600' }}>Recent</Text>
      <FlatList
        data={transactions.slice(0, 6)}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: '600' }}>{item.description ?? 'Transaction'}</Text>
            <Text style={{ color: '#666' }}>{item.category ?? item.bank ?? '—'}</Text>
            <Text style={{ marginTop: 4 }}>{item.type === 'debit' ? '-' : '+'}{item.amount.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
