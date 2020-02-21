const express = require('express');
const router = express.Router();
const { get_isp_list } = require('../controllers/isp');

router.get('/', get_isp_list);

module.exports = router;