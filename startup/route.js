const { ErrorHandler } = require('../utils/errorHandler');
module.exports = function (app) {
    app.get('/', (req, res, next) => {
        res.send('Welcome to ISP app');
    })
    app.get('*', (req, res, next) => {
        next(new ErrorHandler(404, 'Page not found. Please check url'))
    })
};