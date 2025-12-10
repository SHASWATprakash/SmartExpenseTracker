// src/store/useStore.ts
import { createStore } from 'zustand/vanilla';
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

/**
 * Simple id generator for RN POC (no crypto dependency).
 * Collision chance is negligible for demo apps.
 */
function makeId(prefix = 'tx') {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

type State = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  setTransactions: (t: Transaction[]) => void;
  clear: () => void;
};

const store = createStore<State>((set, get) => ({
  transactions: [],
  addTransaction: (t) => {
    const tx = { ...t, id: makeId() };
    const updated = [tx, ...get().transactions];
    set({ transactions: updated });
    AsyncStorage.setItem('transactions', JSON.stringify(updated)).catch(console.warn);
  },
  setTransactions: (t) => {
    set({ transactions: t });
    AsyncStorage.setItem('transactions', JSON.stringify(t)).catch(console.warn);
  },
  clear: () => {
    set({ transactions: [] });
    AsyncStorage.removeItem('transactions').catch(console.warn);
  },
}));

export const useStore = <T,>(selector: (s: State) => T): T => {
  const subscribe = (callback: () => void) => {
    const unsub = (store as any).subscribe(callback);
    return () => unsub();
  };
  const getSnapshot = () => selector((store as any).getState());
  return useSyncExternalStore(subscribe, getSnapshot);
};

export { store }; // exported for non-react modules (smsListener, hydrate)
