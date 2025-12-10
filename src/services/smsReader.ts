import SmsListener from 'react-native-android-sms-listener';
import { parseSms } from './smsParser';
// import { insertTransaction } from '../db'; // placeholder, implement db functions
let subscription: any;

export function startSmsListener(onParsed?: (tx: any) => void) {
  subscription = SmsListener.addListener((message: any) => {
    try {
      const parsed = parseSms(message);
      if (parsed) {
        // persist to DB if you implement insertTransaction
        // insertTransaction(parsed).catch(console.warn);
        if (onParsed) onParsed(parsed);
        console.log('SMS parsed:', parsed);
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
