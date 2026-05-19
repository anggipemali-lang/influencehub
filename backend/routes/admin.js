const express = require('express');
const router = express.Router();
const db = require('../db');

// GET REQUESTS
router.get('/verification-requests', (req, res) => {
  db.query('SELECT * FROM verification_requests WHERE status="pending"', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// APPROVE
router.put('/approve/:id', (req, res) => {
  db.query(
    'UPDATE verification_requests SET status="approved" WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Approved' });
    }
  );
});

// REJECT
router.put('/reject/:id', (req, res) => {
  db.query(
    'UPDATE verification_requests SET status="rejected" WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Rejected' });
    }
  );
});

module.exports = router;