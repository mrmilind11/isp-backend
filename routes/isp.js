const express = require('express');
const router = express.Router();
const { get_isp_list, add_isp, delete_isp, download_pdf, get_isp_cnt } = require('../controllers/isp');
const { uploadFile } = require('../utils/fileUpload');


router.get('/', get_isp_list);
router.post('/', uploadFile.single('image'), add_isp);
router.delete('/', delete_isp);
router.get('/download/:id', download_pdf)
router.get('/count', get_isp_cnt);
module.exports = router;