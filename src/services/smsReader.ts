// src/services/smsReader.ts
import SmsListener from 'react-native-android-sms-listener';
import { parseSms } from './smsParser';
import { insertTransaction } from '../db';
import { store as vanillaStore } from '../store/useStore';

let subscription: any;

export function startSmsListener(onParsed?: (tx: any) => void) {
  // avoid duplicate listeners
  if (subscription) return;
  subscription = SmsListener.addListener(async (message: any) => {
    try {
      const parsed = parseSms(message);
      if (parsed) {
        // persist to sqlite
        try {
          await insertTransaction(parsed);
        } catch (dbErr) {
          console.warn('db insert error', dbErr);
        }

        // push into zustand store immediately
        const addTx = (vanillaStore.getState() as any).addTransaction;
        if (typeof addTx === 'function') {
          // call addTransaction to keep persistence and AsyncStorage in sync
          addTx(parsed);
        } else {
          // fallback: insert at top of array
          const current = (vanillaStore.getState() as any).transactions ?? [];
          vanillaStore.setState({ transactions: [parsed, ...current] });
        }

        if (onParsed) onParsed(parsed);
        console.log('SMS parsed + saved:', parsed);
      }
    } catch (e) {
      console.warn('sms parse error', e);
    }
  });
}

export function stopSmsListener() {
  if (subscription) {
    subscription.remove();
    subscription = null;
  }
}
