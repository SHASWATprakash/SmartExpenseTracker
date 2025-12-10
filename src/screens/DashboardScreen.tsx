// src/screens/DashboardScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BalanceCard from '../components/BalanceCard';
import SpendingChart from '../components/SpendingChart';
import { useStore, store as vanillaStore } from '../store/useStore';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, Spacing } from '../theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';
import { insertTransaction, fetchTransactions } from '../db';
import type { Transaction } from '../types';

type DashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

// Format money
const fmt = (n: number) => {
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return n.toFixed(2);
  }
};

const RecentItem = React.memo(({ item }: { item: Transaction }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.desc}>{item.description ?? 'Transaction'}</Text>
        <Text style={styles.meta}>{item.category ?? item.bank ?? '—'}</Text>
      </View>

      <Text
        style={[
          styles.amount,
          { color: item.type === 'debit' ? '#E53935' : '#16A34A' },
        ]}
      >
        {item.type === 'debit' ? '-' : '+'}
        {fmt(item.amount)}
      </Text>
    </View>

    <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
  </TouchableOpacity>
));

export default function DashboardScreen() {
  const nav = useNavigation<DashboardNavProp>();
  const transactions = useStore((s) => s.transactions) as Transaction[];

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const rows = await fetchTransactions();
      (vanillaStore as any).setState({ transactions: rows });
    } catch {
      // fallback re-emit current state
      const cur = (vanillaStore as any).getState()?.transactions ?? [];
      (vanillaStore as any).setState({ transactions: cur });
    } finally {
      setRefreshing(false);
    }
  }, []);

  // DEV-only button for iOS demo purposes
  const insertSample = async () => {
    const tx: Transaction = {
      id: `dev-${Date.now()}`,
      amount: 250.5,
      type: 'debit',
      date: new Date().toISOString(),
      description: 'Demo Sample',
      category: 'Food',
      bank: 'DEV',
      source: 'manual',
    };

    await insertTransaction(tx);
    const add = (vanillaStore as any).getState()?.addTransaction;
    add ? add(tx) : (vanillaStore as any).setState({ transactions: [tx, ...transactions] });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={transactions.slice(0, 6)}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={[
          styles.listContent,
          !transactions.length && { flex: 1, justifyContent: 'center' },
        ]}
        ListHeaderComponent={
          <>
            {/* CARD */}
            <BalanceCard />

            {/* CHART */}
            <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.lg }}>
              <SpendingChart />
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.btnRow}>
              <PrimaryButton
                title="Add Expense"
                onPress={() => nav.navigate('AddExpense')}
                style={styles.btnHalf}
                textStyle={styles.btnTextFix}
              />
              <PrimaryButton
                title="Transactions"
                onPress={() => nav.navigate('Transactions')}
                style={styles.btnHalf}
                textStyle={styles.btnTextFix}
              />
            </View>

            {/* Recent Section Title */}
            {transactions.length > 0 && (
              <Text style={styles.recentTitle}>Recent</Text>
            )}
          </>
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              No recent transactions yet. Add an expense or enable SMS parsing to auto-import bank messages.
            </Text>

            <PrimaryButton
              title="Add Expense"
              onPress={() => nav.navigate('AddExpense')}
              style={{ marginTop: Spacing.lg, width: 180 }}
            />

            {__DEV__ && (
              <TouchableOpacity onPress={insertSample} style={{ marginTop: Spacing.md }}>
                <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: '600' }}>
                  Insert Sample Txn (DEV)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item }) => <RecentItem item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  listContent: {
    paddingBottom: 80,
  },

  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },

  btnHalf: {
    flex: 0.48,
    paddingVertical: 14,
  },

  btnTextFix: {
    fontSize: 15,
    fontWeight: '600',
  },

  recentTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    marginLeft: Spacing.lg,
    fontWeight: '700',
    fontSize: 17,
    color: Colors.text,
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  desc: { fontWeight: '600', fontSize: 15 },
  meta: { color: '#666', marginTop: 2 },
  amount: { fontWeight: '700', fontSize: 16 },
  date: { color: '#999', marginTop: 8, fontSize: 12 },

  emptyWrap: {
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  emptyText: {
    color: Colors.muted,
    lineHeight: 20,
    textAlign: 'center',
    fontSize: 15,
  },
});
