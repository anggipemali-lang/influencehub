const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// CREATE CAMPAIGN
router.post('/', (req, res) => {
  const { brandId, title, description, budget } = req.body;

  const id = uuidv4();

  db.query(
    'INSERT INTO campaigns (id,brandId,title,description,budget) VALUES (?,?,?,?,?)',
    [id, brandId, title, description, budget],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Campaign created' });
    }
  );
});

// GET BRAND CAMPAIGNS
router.get('/:brandId', (req, res) => {
  db.query(
    'SELECT * FROM campaigns WHERE brandId=?',
    [req.params.brandId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

module.exports = router;