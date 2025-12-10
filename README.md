# SmartExpenseTracker

A lightweight React Native expense tracking app with:

📊 Dashboard with charts (react-native-chart-kit)

💸 Manual expense entry

🤖 Automatic SMS parsing on Android (extract bank transaction amounts)

🗄️ Local storage with SQLite + Zustand

🎨 Modern UI with gradient cards, spacing tokens, reusable components

# 🚀 Features
✅ Core Functionality

Add debit / credit transactions manually

Auto-read bank SMS (Android) & auto-insert expenses

Calculate monthly spending

Display recent transactions

Clean reusable components

SQLite persistent storage

Chart visualizations for spending

# 🧩 Architecture
src/
 ├── components/
 │     ├── BalanceCard.tsx
 │     ├── SpendingChart.tsx
 │     ├── PrimaryButton.tsx
 │     └── ...
 ├── navigation/
 │     └── index.tsx
 ├── screens/
 │     ├── SplashScreen.tsx
 │     ├── OnboardingScreen.tsx
 │     ├── DashboardScreen.tsx
 │     ├── AddExpenseScreen.tsx
 │     └── TransactionsScreen.tsx
 ├── store/
 │     └── useStore.ts
 ├── db/
 │     └── index.ts  (SQLite setup)
 ├── services/
 │     └── smsReader.ts (Android SMS)
 ├── theme/
 │     ├── Colors.ts
 │     └── Spacing.ts
 ├── utils/
 │     └── date.ts
 └── App.tsx

#  🛠️ Installation
1️⃣ Clone
git clone https://github.com/<your-user>/SmartExpenseTracker.git
cd SmartExpenseTrackerApp

2️⃣ Install dependencies
yarn install

3️⃣ iOS Setup
cd ios
pod install
cd ..
yarn ios

4️⃣ Android Setup

Ensure an emulator is running:

yarn android

# 🤖 SMS Auto-Parsing (Android only)
Enable permission inside Onboarding

App requests READ_SMS

If granted → begins listening for incoming SMS

Incoming SMS is filtered using regex for banking format

Parsed into:

{
  amount,
  type: 'debit' | 'credit',
  description,
  date,
  source: 'sms'
}

Test incoming SMS in emulator:
adb emu sms send 5551234 "Your account debited with INR 450.00 at KFC"


If regex matches → transaction is added to dashboard automatically.

# 🗄️ Database (SQLite)

Uses react-native-sqlite-storage with fallback to Zustand memory store.

Tables
transactions: id, amount, type, category, description, date, source

Methods

insertTransaction()

fetchTransactions()

# 🎨 UI & Components
BalanceCard

Gradient UI

Shows total balance + monthly expenses

SpendingChart

Uses react-native-chart-kit

Auto-updates when transactions change

PrimaryButton

Fully customizable (style + textStyle)

Used across Dashboard & Onboarding

# 🔄 State Management

Using Zustand:

transactions: Transaction[]
addTransaction(tx)
removeTransaction(id)
hydrateFromDB()

# ▶️ Running the App
Start Metro bundler:
yarn start

Run iOS:
yarn ios

Run Android:
yarn android

# 🧪 DEV Mode Helpers
Insert sample transaction:

Dashboard → Insert Sample Txn (DEV)

Adds a fake Food transaction for testing.

# 📦 Scripts (npm/yarn)
Yarn
"scripts": {
  "start": "react-native start",
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "clean": "rm -rf node_modules && yarn install"
}

npm (same as yarn)
npm run start
npm run android
npm run ios

# 🧹 Code Quality

Component-based architecture

Centralized theme tokens (Colors, Spacing)

Proper SafeAreaView usage

FlatList with proper keyExtractor

SQLite async loading

Android/iOS platform behavior handled separately