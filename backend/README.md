# BillPilot Backend API

A Node.js + Express + PostgreSQL backend for the BillPilot subscription management application.

## 🎯 **What is BillPilot?**

**BillPilot** is a smart subscription management app that helps users:
- 📱 **Track all their subscriptions** in one place
- 💰 **Monitor spending** and stay within budget
- 🔔 **Get reminders** before bills are due
- 📊 **Analyze spending patterns** and find savings
- 🚨 **Alert users** about price increases and trial endings

## 🚀 **Core App Functions & Features**

### **1. 📱 Subscription Management**
- **Add new subscriptions** (Netflix, Spotify, utilities, etc.)
- **Track subscription details**:
  - Name, amount, billing cycle
  - Category (Entertainment, Utilities, Health, etc.)
  - Due dates and payment status
  - Auto-renewal settings
  - Free trial tracking

### **2. 💰 Financial Tracking & Budget Management**
- **Monthly budget setup** during user registration
- **Real-time spending calculations**
- **Category-based spending breakdown**
- **Annual vs. monthly cost analysis**
- **Budget alerts** when approaching limits
- **Currency support** (USD, EUR, etc.)

### **3. 🔔 Smart Notifications**
- **Bill due reminders** (customizable: 1, 3, 7 days before)
- **Price increase alerts** when subscriptions cost more
- **Free trial ending warnings** before charges begin
- **Budget limit notifications** when approaching limits
- **Overdue bill alerts**

### **4. 📊 Analytics & Insights**
- **Spending trends** over time
- **Category breakdown** (Entertainment: $45/month, Utilities: $120/month)
- **Budget insights** (80% of budget used, $200 remaining)
- **Savings opportunities**:
  - Unused subscriptions
  - Annual vs. monthly savings
  - Duplicate services

### **5. 👤 User Management**
- **Personal profiles** with budget preferences
- **Notification preferences** (what alerts to receive)
- **Timezone support** for accurate reminders
- **Multiple currency support**

## 🏗️ **Tech Stack**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting
- **Language**: TypeScript

## 📋 **Prerequisites**

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 **Quick Start**

### **1. Install Dependencies**

```bash
npm install
```

### **2. Environment Setup**

Copy the environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=billpilot
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

### **3. Database Setup**

#### **Option A: Using psql**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE billpilot;

# Connect to the database
\c billpilot

# Run the schema file
\i src/models/database.sql
```

#### **Option B: Using pgAdmin**

1. Open pgAdmin
2. Create a new database called `billpilot`
3. Open the Query Tool
4. Copy and paste the contents of `src/models/database.sql`
5. Execute the script

#### **Option C: Using our script (Recommended)**

```bash
# Initialize database with one command
npm run init-db
```

### **4. Start Development Server**

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📚 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration (includes budget setup)
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### **Subscriptions**
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/:id` - Get subscription by ID
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `PATCH /api/subscriptions/:id/mark-paid` - Mark as paid
- `GET /api/subscriptions/upcoming/bills` - Get upcoming bills

### **Users & Budget Management**
- `GET /api/users/profile` - Get user profile and budget
- `PUT /api/users/profile` - Update user profile and budget
- `PUT /api/users/password` - Update password
- `DELETE /api/users/account` - Delete account

### **Notifications**
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### **Analytics & Budget Insights**
- `GET /api/analytics/spending` - Get spending analytics
- `GET /api/analytics/spending/category` - Get spending by category
- `GET /api/analytics/spending/monthly` - Get monthly trend
- `GET /api/analytics/budget/insights` - Get budget insights
- `GET /api/analytics/savings/opportunities` - Get savings opportunities

## 🧪 **Testing the API**

### **Health Check**
```bash
curl http://localhost:3001/health
```

### **Test Authentication (placeholder endpoints)**
```bash
# Register with budget
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","monthlyBudget":1000}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Test Protected Endpoints**
```bash
# Get subscriptions (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/subscriptions
```

## 🏗️ **Project Structure**

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers (to be implemented)
├── middleware/      # Custom middleware
├── models/          # Database models and schema
├── routes/          # API route definitions
├── services/        # Business logic (to be implemented)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (to be implemented)
└── index.ts         # Main server file
```

## 💰 **Budget Management System**

### **How Budgets Work:**
1. **User Registration**: Users set monthly budget during signup
2. **Budget Storage**: Stored in `users.monthly_budget` field
3. **Real-time Tracking**: App calculates spending vs. budget
4. **Smart Alerts**: Notifications when approaching budget limits

### **Budget Features:**
- **Flexible Setup**: Users can set any amount ($0 - $10,000+)
- **Category Breakdown**: Track spending by subscription type
- **Monthly Analysis**: Compare spending to budget over time
- **Smart Recommendations**: Suggest budget adjustments

### **Budget Input Methods:**
- **Direct Input**: Simple dollar amount field
- **Slider Selection**: Visual budget range selector
- **Category-Based**: Set budget per subscription category
- **Smart Suggestions**: AI-powered budget recommendations

## 🔄 **User Workflow Example**

### **1. Onboarding:**
```
User opens app → Sets monthly budget → Adds first subscription
```

### **2. Daily Usage:**
```
View upcoming bills → Check budget status → Add new subscriptions
```

### **3. Notifications:**
```
Get reminded about bills → Receive price change alerts → Budget limit warnings
```

### **4. Analysis:**
```
Monthly spending reports → Category breakdowns → Savings recommendations
```

## 🔧 **Development**

### **Available Scripts**

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run init-db` - Initialize database with schema and sample data
- `npm test` - Run tests (to be implemented)

### **Code Style**

- Use TypeScript strict mode
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for database operations
- Validate all inputs using express-validator

## 🚧 **Current Implementation Status**

### **✅ Completed:**
- **Complete project structure**
- **Database schema and migrations**
- **Route definitions with validation**
- **Authentication middleware**
- **Security middleware**
- **Error handling**
- **PostgreSQL database setup**
- **Sample data and testing**

### **⏳ Still Needed:**
- [ ] Implement controllers with business logic
- [ ] Add database service layer
- [ ] Implement JWT authentication
- [ ] Add password hashing
- [ ] Create database queries
- [ ] Add input sanitization
- [ ] Implement rate limiting
- [ ] Add logging
- [ ] Write tests
- [ ] Add API documentation

## 🎯 **Target Users**

- **Young professionals** with multiple subscriptions
- **Families** managing household bills
- **Students** tracking educational subscriptions
- **Small businesses** managing business services
- **Anyone** who wants to **save money** and **stay organized**

## 🔮 **Future Features**

- **Bill payment integration** (pay directly from app)
- **Receipt scanning** (AI-powered bill detection)
- **Family sharing** (manage family subscriptions)
- **Credit score impact** (payment history tracking)
- **Subscription marketplace** (find better deals)
- **Real-time spending alerts** via push notifications
- **Integration with banking apps** for automatic bill detection

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the ISC License.

## 🆘 **Support**

For questions or issues:
1. Check the API documentation
2. Review the database schema
3. Test with the sample data
4. Check server logs for errors

---

**BillPilot** - Your personal financial assistant for subscription management! 🚀
