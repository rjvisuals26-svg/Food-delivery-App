const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


// Database connection (XAMPP Default)
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'beautify petals_db'
});

db.connect((err) => {
  if (err) {
    console.error('⚠️ Error connecting to MySQL database:', err.message);
    return;
  }
  console.log('✅ Task 5 Backend: Connected to MySQL database.');
});

// --- TASK 5 ENDPOINTS (Food Delivery) ---
app.get('/restaurants', (req, res) => {
  const query = 'SELECT * FROM restaurants ORDER BY id ASC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching restaurants:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Fetched ${results.length} restaurants`);
    res.json(results);
  });
});

app.get('/orders', (req, res) => {
  const query = 'SELECT * FROM orders ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`Fetched ${results.length} orders`);
    res.json(results);
  });
});

app.get('/orders/:id', (req, res) => {
  const query = 'SELECT * FROM order_items WHERE order_id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/orders', (req, res) => {
  const { total_price, items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ error: 'No items in order' });

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    const orderQuery = 'INSERT INTO orders (total_price) VALUES (?)';
    db.query(orderQuery, [total_price], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: err.message }));
      }

      const orderId = result.insertId;
      const itemsData = items.map(item => [orderId, item.name, item.price]);
      const itemsQuery = 'INSERT INTO order_items (order_id, item_name, price) VALUES ?';

      db.query(itemsQuery, [itemsData], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: err.message }));
        }

        db.commit(err => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: err.message }));
          }
          res.json({ success: true, orderId });
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`🚀 Task 5 Server running on http://localhost:${port}`);
});
