CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    active BOOLEAN DEFAULT false
);



-- USERS (déjà créé)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    active BOOLEAN DEFAULT false
);

-- CAMPAIGNS
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name TEXT,
    client_id VARCHAR,
    agency_id VARCHAR,
    budget INT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANALYTICS
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    campaign_id INT,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0
);


UPDATE users SET role='admin'
WHERE email IN (
  'juntanluyis@gmail.com',
  'jonathanlouis349@gmail.com',
  'info.piblay@gmail.com'
);


CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    action TEXT,
    user_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


