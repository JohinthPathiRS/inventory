const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'delivery_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing login query: ', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    } else {
      if (results.length > 0) {
        const user = results[0];
        res.json({ success: true, role: user.role });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    }
  });
});

// Inventory API
app.post('/api/inventory', (req, res) => {
  const { productCategory, isDamaged, isPerishable, expiryDate, action } = req.body;

  if (action === 'add') {
    // Add inventory to the database
    const query = `INSERT INTO inventory (productCategory, isDamaged, isPerishable, expiryDate) VALUES (?, ?, ?, ?)`;

    db.query(query, [productCategory, isDamaged, isPerishable, expiryDate], (err, result) => {
      if (err) {
        console.error('Error executing inventory query: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ success: true, message: 'Inventory added successfully' });
      }
    });
  } else if (action === 'update') {
    // Update inventory (e.g., when taken out for delivery)
    // Implement the logic based on your requirements
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

// Delivery Agent API
app.get('/api/delivery/agent/:id', (req, res) => {
  const agentId = req.params.id;

  // Retrieve delivery information for the given agent
  const query = `SELECT * FROM deliveries WHERE agentId = ?`;

  db.query(query, [agentId], (err, result) => {
    if (err) {
      console.error('Error executing delivery agent query: ', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ deliveries: result });
    }
  });
});

// Other routes and logic as needed

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
