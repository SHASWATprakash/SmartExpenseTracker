import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

type State = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  setTransactions: (t: Transaction[]) => void;
  clear: () => void;
};

export const useStore = create<State>((set, get) => ({
  transactions: [],
  addTransaction: (t) => {
    const tx = { ...t, id: uuidv4() };
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
