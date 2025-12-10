# Source layout

src/
  components/     # small, reusable pieces (BalanceCard, Chart, ListItem)
  screens/        # top-level screens (Splash, Onboarding, Dashboard, AddExpense, Transactions)
  navigation/     # react navigation stack
  hooks/          # custom hooks (useHydrateStore, usePermissions)
  services/       # db, sms parser/listener, exporters
  db/             # sqlite helpers
  store/          # zustand store
  types/          # global types
  utils/          # helpers (date, money)
  theme/          # theme constants
  assets/         # images/fonts
