// src/screens/TransactionsScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, store as vanillaStore } from '../store/useStore';
import type { Transaction } from '../types';

const formatDate = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const TransactionItem = React.memo(function TransactionItem({ item }: { item: Transaction }) {
  return (
    <TouchableOpacity style={styles.item}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.desc}>{item.description ?? 'Transaction'}</Text>
          <Text style={styles.meta}>{item.category ?? item.bank ?? '—'}</Text>
        </View>
        <Text style={[styles.amount, { color: item.type === 'debit' ? '#E53935' : '#16A34A' }]}>
          {item.type === 'debit' ? '-' : '+'}{item.amount.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </TouchableOpacity>
  );
});

export default function TransactionsScreen() {
  const transactions = useStore((s) => s.transactions) as Transaction[];
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // If you have a DB hydrate method, call it here. For now we re-read the vanilla store state.
      const current = (vanillaStore as any).getState()?.transactions ?? [];
      (vanillaStore as any).setState({ transactions: current });
    } catch (e) {
      console.warn('refresh error', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: Transaction }) => <TransactionItem item={item} />, []);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList<Transaction>
        data={transactions}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={transactions.length ? undefined : styles.emptyContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyMessage}>
            <Text style={styles.emptyText}>No transactions yet — add one or enable SMS parsing.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F6F7' },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  desc: { fontWeight: '600', fontSize: 16 },
  meta: { color: '#666', marginTop: 4 },
  amount: { fontWeight: '700', fontSize: 16 },
  date: { color: '#999', marginTop: 8, fontSize: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyMessage: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#666', textAlign: 'center' },
});
