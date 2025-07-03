-- Create database
CREATE DATABASE assettrackr;

-- Connect to the database
\c assettrackr;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assets table
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('STOCK', 'MUTUAL_FUND', 'CRYPTO', 'BOND')),
    sector VARCHAR(50) NOT NULL,
    quantity DECIMAL(19,8) NOT NULL,
    purchase_price DECIMAL(19,2) NOT NULL,
    current_price DECIMAL(19,2),
    purchase_date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create predictions table
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    prediction_date DATE NOT NULL,
    predicted_price DECIMAL(19,2) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    model VARCHAR(20) NOT NULL CHECK (model IN ('LSTM', 'ARIMA', 'LINEAR_REGRESSION')),
    accuracy DECIMAL(5,4) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_symbol ON assets(symbol);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_sector ON assets(sector);

CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_symbol ON predictions(symbol);
CREATE INDEX idx_predictions_date ON predictions(prediction_date);
CREATE INDEX idx_predictions_created_at ON predictions(created_at);

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

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (username, email, password) VALUES 
('demo_user', 'demo@assettrackr.com', '$2a$10$example_hashed_password'),
('john_doe', 'john@example.com', '$2a$10$example_hashed_password');

-- Insert sample assets
INSERT INTO assets (symbol, name, type, sector, quantity, purchase_price, current_price, purchase_date, user_id) 
SELECT 
    'AAPL', 'Apple Inc.', 'STOCK', 'technology', 50, 150.00, 175.50, '2024-01-15', id 
FROM users WHERE username = 'demo_user';

INSERT INTO assets (symbol, name, type, sector, quantity, purchase_price, current_price, purchase_date, user_id) 
SELECT 
    'TSLA', 'Tesla Inc.', 'STOCK', 'consumer', 25, 200.00, 245.80, '2024-02-10', id 
FROM users WHERE username = 'demo_user';
