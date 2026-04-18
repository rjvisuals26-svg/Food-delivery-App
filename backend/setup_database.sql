CREATE DATABASE IF NOT EXISTS `beautify petals_db`;
USE `beautify petals_db`;

-- Task 5: Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  image_url TEXT,
  rating DECIMAL(3,1),
  delivery_time VARCHAR(20),
  cuisine VARCHAR(100),
  is_featured TINYINT DEFAULT 0,
  price DECIMAL(10,2)
);

-- Task 5: Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  total_price DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Task 5: Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  item_name VARCHAR(255),
  price DECIMAL(10,2)
);

-- SEED DATA
INSERT INTO restaurants (name, image_url, rating, delivery_time, cuisine, is_featured, price) VALUES
('Student Biryani', 'https://images.unsplash.com/photo-1589301973599-03cdcd432f3b?auto=format&fit=crop&q=80&w=400', 4.8, '25 min', 'Pakistani', 1, 550),
('Khyber Shinwari', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=400', 4.9, '45 min', 'Traditional', 1, 2800),
('Big Bash Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', 4.6, '20 min', 'Fast Food', 0, 850),
('Delizia Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400', 4.9, '30 min', 'Desserts', 1, 2200),
('Burns Road Bun Kabab', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=400', 4.7, '15 min', 'Street Food', 1, 350),
('Lahori Chanay', 'https://images.unsplash.com/photo-1585937421612-70a008356f96?auto=format&fit=crop&q=80&w=400', 4.8, '20 min', 'Traditional', 0, 350),
('Pompei Italian', 'https://images.unsplash.com/photo-1473093226795-af9932fe5855?auto=format&fit=crop&q=80&w=400', 4.9, '50 min', 'Italian', 0, 3500);
