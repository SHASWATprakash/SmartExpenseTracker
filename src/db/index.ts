import SQLite from 'react-native-sqlite-storage';
import { Transaction } from '../types';

SQLite.enablePromise(true);
const DB_NAME = 'smart_expense.db';

export async function getDB() {
  return SQLite.openDatabase({ name: DB_NAME, location: 'default' });
}

export async function initDB() {
  const db = await getDB();
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL,
      type TEXT,
      date TEXT,
      bank TEXT,
      description TEXT,
      category TEXT,
      source TEXT
    );`
  );
  return db;
}

export async function insertTransaction(tx: Transaction) {
  const db = await getDB();
  await db.executeSql(
    `INSERT OR REPLACE INTO transactions (id, amount, type, date, bank, description, category, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tx.id, tx.amount, tx.type, tx.date, tx.bank || '', tx.description || '', tx.category || '', tx.source]
  );
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const db = await getDB();
  const [res] = await db.executeSql(`SELECT * FROM transactions ORDER BY date DESC;`);
  const rows: Transaction[] = [];
  for (let i = 0; i < res.rows.length; i++) rows.push(res.rows.item(i));
  return rows;
}
