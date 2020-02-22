const multer = require('multer');
const path = require('path');
const { ErrorHandler } = require('./errorHandler')


const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.gif'];
const getDestination = function (req, file, cb) {
    cb(null, 'public/images');
}
const getFileName = function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, 'img_' + Date.now() + ext);
}
const storage = multer.diskStorage(
    {
        destination: getDestination,
        filename: getFileName,

    }
)
const fileFilter = function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (allowedFileTypes.indexOf(ext) === -1) {
        return cb(new ErrorHandler(400, 'File format not supported'));
    }
    return cb(null, true)
}

const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: fileFilter
})
module.exports.uploadFile = uploadFile;