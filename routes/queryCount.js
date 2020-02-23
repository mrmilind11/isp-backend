const express = require('express');
const { get_total_count } = require('../controllers/queryCount')
const router = express.Router();

router.get('/total', get_total_count);

module.exports = router;