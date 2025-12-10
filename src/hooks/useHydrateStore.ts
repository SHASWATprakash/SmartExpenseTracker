// src/hooks/useHydrateStore.ts
import { useEffect } from 'react';
import { initDB, fetchTransactions } from '../db';
import { store as vanillaStore } from '../store/useStore'; // vanilla store exported
import { Transaction } from '../types';

export const useHydrateStore = () => {
  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        await initDB();
        const rows: Transaction[] = await fetchTransactions();
        if (!mounted) return;
        // set transactions into zustand (use the setTransactions method)
        const setTx = (vanillaStore.getState() as any).setTransactions;
        if (typeof setTx === 'function') {
          setTx(rows);
        } else {
          // fallback: set state directly
          vanillaStore.setState({ transactions: rows });
        }
      } catch (e) {
        console.warn('hydrate error', e);
      }
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);
};
