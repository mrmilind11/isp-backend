const express = require('express');
const router = express.Router();
const { get_isp_list, add_isp, delete_isp } = require('../controllers/isp');
const { uploadFile } = require('../utils/fileUpload');


router.get('/', get_isp_list);
router.post('/', uploadFile.single('image'), add_isp);
router.delete('/', delete_isp);

module.exports = router;