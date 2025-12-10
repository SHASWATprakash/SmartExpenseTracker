import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../store/useStore';

export const useHydrateStore = () => {
  const setTransactions = useStore((s) => s.setTransactions);
  useEffect(() => {
    AsyncStorage.getItem('transactions')
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setTransactions(parsed);
          } catch (e) {
            console.warn('hydrate parse error', e);
          }
        }
      })
      .catch((e) => console.warn('hydrate err', e));
  }, [setTransactions]);
};
