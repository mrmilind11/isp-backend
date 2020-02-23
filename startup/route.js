const { ErrorHandler } = require('../utils/errorHandler');
const ISPRoute = require('../routes/isp');
const queryCountRoute = require('../routes/queryCount');
module.exports = function (app) {
    app.get('/', (req, res, next) => {
        res.send('Welcome to ISP app');
    })
    app.use('/api/isp', ISPRoute);
    app.use('/api/querycount', queryCountRoute);
    app.get('*', (req, res, next) => {
        next(new ErrorHandler(404, 'Page not found. Please check url'))
    })
};