-- ================= USERS =================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('client','agency','admin')) NOT NULL,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= CAMPAIGNS =================
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    client_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
    agency_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    budget NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= ANALYTICS =================
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    campaign_id INT REFERENCES campaigns(id) ON DELETE CASCADE,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0
);

-- ================= LOGS =================
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= INDEX (PERFORMANCE) =================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_agency ON campaigns(agency_id);

-- ================= ADMIN =================
UPDATE users
SET role = 'admin'
WHERE email IN (
  'juntanluyis@gmail.com',
  'jonathanlouis349@gmail.com',
  'info.piblay@gmail.com'
);