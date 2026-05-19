const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password, role, displayName } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const id = uuidv4();

  db.query(
    'INSERT INTO users (id,email,password,role,displayName) VALUES (?,?,?,?,?)',
    [id, email, hashed, role, displayName],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'User created' });
    }
  );
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email=?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign({ id: user.id, role: user.role }, 'SECRET_KEY');

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName
      }
    });
  });
});

module.exports = router;