const { ErrorHandler } = require('../utils/errorHandler');
const get_isp_list = (req, res, next) => {
    res.send({
        name: 'flower service',
        imageUrl: req.protocol + '://' + req.get('host') + '/images/flower.jpg'
    });
}
const add_isp = (req, res, next) => {
    console.log('file', req.file);
    console.log('body', req.body);
    res.send({ file: req.file })
}
module.exports.get_isp_list = get_isp_list;
module.exports.add_isp = add_isp;