import { Transaction } from '../types';

export function parseSms(message: any): Transaction | null {
  const { originatingAddress = '', body = '' } = message || {};
  if (!body) return null;
  const normalized = body.toUpperCase();
  const bank = originatingAddress.toUpperCase();
  const amountMatch = normalized.match(/(?:RS|INR|₹)\s?([0-9,]+(?:\.[0-9]{1,2})?)/) || normalized.match(/([0-9,]+(?:\.[0-9]{1,2})?)\s?(?:INR|RS|₹)/);
  if (!amountMatch) return null;
  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  const type: 'debit' | 'credit' = /CR|CREDIT|REFUND|CASHBACK/.test(normalized) ? 'credit' : 'debit';
  const dateMatch = normalized.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
  const date = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();
  const description = normalized.slice(0, 120);
  return {
    id: `${Date.now()}`,
    amount,
    type,
    date,
    bank,
    description,
    source: 'sms',
  };
}
