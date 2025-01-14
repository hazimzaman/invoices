import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, company_name, email, phone, address, logo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (name, company_name, email, phone, address, logo) VALUES (?, ?, ?, ?, ?, ?)',
      [name, company_name, email, phone, address, logo]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clients endpoints
app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { user_id, name, company_name, vat, phone, email, address } = req.body;
    const [result] = await pool.query(
      'INSERT INTO clients (user_id, name, company_name, vat, phone, email, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, name, company_name, vat, phone, email, address]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Invoices endpoints
app.get('/api/invoices', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, c.name as client_name, c.company_name as client_company 
      FROM invoices i 
      JOIN clients c ON i.client_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const { user_id, client_id, invoice_number, date, total_amount, items } = req.body;
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [invoiceResult] = await connection.query(
        'INSERT INTO invoices (user_id, client_id, invoice_number, date, total_amount) VALUES (?, ?, ?, ?, ?)',
        [user_id, client_id, invoice_number, date, total_amount]
      );

      const invoice_id = invoiceResult.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO invoice_items (invoice_id, name, price) VALUES (?, ?, ?)',
          [invoice_id, item.name, item.price]
        );
      }

      await connection.commit();
      res.json({ id: invoice_id });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});