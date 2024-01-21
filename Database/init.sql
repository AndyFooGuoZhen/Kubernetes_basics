-- Create database
CREATE DATABASE mydatabase;

-- Use the database
USE mydatabase;

-- Create table
CREATE TABLE users (
  id INT AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- Insert sample data
INSERT INTO users (name, email) VALUES
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com');