-- Create user
CREATE USER myuser WITH PASSWORD 'mypassword';

-- Create database
CREATE DATABASE mydb OWNER myuser;

-- Connect to the database
\c mydb

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
