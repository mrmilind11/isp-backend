const express = require('express');
const router = express.Router();
const { get_isp_list, add_isp } = require('../controllers/isp');

router.get('/', get_isp_list);
route.post('/', add_isp);

module.exports = router;