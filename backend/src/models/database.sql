-- Create database (run this separately if needed)
-- CREATE DATABASE billpilot;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    monthly_budget DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    avatar TEXT,
    notification_preferences JSONB NOT NULL DEFAULT '{
        "reminderDays": [1, 3, 7],
        "priceIncreaseAlerts": true,
        "trialEndAlerts": true,
        "overdueAlerts": true
    }',
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'Entertainment', 'Utilities', 'Rent', 'Education', 
        'Health', 'Transport', 'Food', 'Other'
    )),
    recurrence VARCHAR(20) NOT NULL CHECK (recurrence IN ('Weekly', 'Monthly', 'Yearly')),
    next_due_date DATE NOT NULL,
    start_date DATE NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    color VARCHAR(7) NOT NULL,
    description TEXT,
    notes TEXT,
    is_free_trial BOOLEAN DEFAULT false,
    trial_end_date DATE,
    previous_amount DECIMAL(10,2),
    auto_renew BOOLEAN DEFAULT true,
    reminder_days INTEGER[] DEFAULT '{1, 3, 7}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'reminder', 'price_increase', 'trial_ending', 'overdue', 'budget_alert'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_next_due_date ON subscriptions(next_due_date);
CREATE INDEX idx_subscriptions_category ON subscriptions(category);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_users_email ON users(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO users (name, email, password, monthly_budget, currency, timezone) VALUES
('John Doe', 'john@example.com', '$2b$10$example.hash.here', 1000.00, 'USD', 'America/New_York'),
('Jane Smith', 'jane@example.com', '$2b$10$example.hash.here', 800.00, 'USD', 'America/Los_Angeles');

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, name, amount, category, recurrence, next_due_date, start_date, color) VALUES
((SELECT id FROM users WHERE email = 'john@example.com'), 'Netflix', 15.99, 'Entertainment', 'Monthly', '2024-01-15', '2023-01-01', '#8B5CF6'),
((SELECT id FROM users WHERE email = 'john@example.com'), 'Electric Bill', 89.50, 'Utilities', 'Monthly', '2024-01-20', '2023-01-01', '#10B981'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Spotify Premium', 9.99, 'Entertainment', 'Monthly', '2024-01-10', '2023-01-01', '#8B5CF6');
