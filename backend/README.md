# BillPilot Backend API

A Node.js + Express + PostgreSQL backend for the BillPilot subscription management application.

## 🚀 Features

- **Authentication**: JWT-based user authentication and authorization
- **User Management**: User registration, login, profile management
- **Subscription Management**: CRUD operations for subscriptions
- **Notifications**: User notification system
- **Analytics**: Spending analytics and budget insights
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: PostgreSQL with proper indexing and constraints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

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

### 3. Database Setup

#### Option A: Using psql

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

#### Option B: Using pgAdmin

1. Open pgAdmin
2. Create a new database called `billpilot`
3. Open the Query Tool
4. Copy and paste the contents of `src/models/database.sql`
5. Execute the script

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/:id` - Get subscription by ID
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `PATCH /api/subscriptions/:id/mark-paid` - Mark as paid
- `GET /api/subscriptions/upcoming/bills` - Get upcoming bills

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update password
- `DELETE /api/users/account` - Delete account

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Analytics
- `GET /api/analytics/spending` - Get spending analytics
- `GET /api/analytics/spending/category` - Get spending by category
- `GET /api/analytics/spending/monthly` - Get monthly trend
- `GET /api/analytics/budget/insights` - Get budget insights
- `GET /api/analytics/savings/opportunities` - Get savings opportunities

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Test Authentication (placeholder endpoints)
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","monthlyBudget":1000}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🏗️ Project Structure

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

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

### Code Style

- Use TypeScript strict mode
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for database operations
- Validate all inputs using express-validator

## 🚧 Next Steps

The current implementation includes:

✅ **Complete project structure**
✅ **Database schema and migrations**
✅ **Route definitions with validation**
✅ **Authentication middleware**
✅ **Security middleware**
✅ **Error handling**

**Still needed:**
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
