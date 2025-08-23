# 📱 BillPilot – Subscription & Bill Tracker

**Take control of your bills and subscriptions with smart insights and automated reminders.**

## 🚀 Overview

BillPilot is a personal finance mobile app designed to help users track, manage, and optimize their recurring bills and subscriptions. Unlike simple reminder apps, BillPilot provides smart insights, budgeting support, and automatic detection of hidden subscriptions.

### ✨ Special Value
- **Subscription-focused** - Not just general reminders
- **Smart notifications** - Warn before payment, flag cost increases
- **Expense analysis** - Budget optimization and spending insights
- **Future enhancements** - Bank account/transaction sync

## 🔹 Core Features

### 📊 Bill & Subscription Management
- Add subscriptions manually (Netflix $15/month, etc.)
- Categorize bills (Entertainment, Utilities, Rent, Education, etc.)
- Track recurring bills (monthly, yearly, weekly)
- Mark bills as "Paid" or "Unpaid"
- Set start dates and due dates
- Add notes and descriptions

### 🔔 Smart Notifications
- Remind users 3 days before, 1 day before, and on due date
- Alerts when subscription prices increase
- Alerts when free trials are about to end
- Overdue payment reminders
- Budget limit warnings

### 📈 Analytics & Dashboard
- Monthly/Yearly expense breakdown by category
- Spending trends and patterns
- Budget insights and recommendations
- Savings opportunities identification

### 💰 Budget & Goals
- Set monthly budget for subscriptions
- Track spending against budget
- Get recommendations for optimization
- Identify rarely used subscriptions

### 🔄 Backup & Sync
- User account management
- Cloud data storage (planned)
- Cross-device synchronization (planned)

## 🛠️ Technology Stack

### Frontend (Mobile App)
- **React Native** with Expo - Cross-platform development
- **TypeScript** - Strong typing and maintainability
- **Expo Router** - File-based navigation
- **Zustand** - State management
- **React Native Paper** - UI components

### Backend (Planned)
- **Node.js + Express** or **Firebase** - Backend services
- **MongoDB/Firestore** - Database
- **Firebase Auth** - Authentication
- **Firebase Cloud Messaging** - Push notifications

## 📱 App Screens

1. **Splash Screen** - App logo and tagline
2. **Home Dashboard** - Budget overview, upcoming bills, quick stats
3. **Add Subscription** - Form to add new bills/subscriptions
4. **Analytics** - Spending charts and insights
5. **Notifications** - All reminders and alerts
6. **Profile** - User settings and preferences

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd billpilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

### Development Commands

```bash
# Start development server
npm run dev

# Build for web
npm run build:web

# Lint code
npm run lint
```

## 📊 Data Structure

### Subscription Model
```typescript
interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: SubscriptionCategory;
  recurrence: RecurrenceType;
  nextDueDate: Date;
  startDate: Date;
  isPaid: boolean;
  color: string;
  description?: string;
  notes?: string;
  isFreeTrial?: boolean;
  trialEndDate?: Date;
  previousAmount?: number;
  autoRenew?: boolean;
  reminderDays?: number[];
}
```

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  monthlyBudget: number;
  notificationPreferences: {
    reminderDays: number[];
    priceIncreaseAlerts: boolean;
    trialEndAlerts: boolean;
    overdueAlerts: boolean;
  };
  currency: string;
  timezone: string;
}
```

## 🎯 User Flow Example

1. **User installs BillPilot** → Signs up with email/Google
2. **Adds subscriptions**:
   - Netflix: $15.99/month
   - Spotify: $9.99/month
   - Electricity: $85.50/month
   - Rent: $500/month
3. **Dashboard shows**:
   - Total: $611.48 this month
   - Budget: $500 (122% used - over budget!)
4. **Smart notifications**:
   - Remind before each bill due date
   - Alert about budget overspending
5. **Analytics reveal**:
   - Entertainment: 4.2%
   - Utilities: 14.0%
   - Rent: 81.8%
6. **User optimizes**:
   - Cancels unused subscriptions
   - Reviews entertainment spending

## 🔮 Future Enhancements

### Phase 2
- [ ] Bank account integration (Plaid API)
- [ ] Automatic bill detection
- [ ] Payment history tracking
- [ ] Export data (CSV, Excel)

### Phase 3
- [ ] Family/shared accounts
- [ ] Bill splitting
- [ ] Subscription recommendations
- [ ] Price comparison tools

### Phase 4
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Integration with calendar apps
- [ ] Voice commands

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [docs.billpilot.app](https://docs.billpilot.app)
- **Issues**: [GitHub Issues](https://github.com/your-org/billpilot/issues)
- **Email**: support@billpilot.app

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons by [Lucide](https://lucide.dev/)
- State management with [Zustand](https://github.com/pmndrs/zustand)

---

**Made with ❤️ for better financial management**
