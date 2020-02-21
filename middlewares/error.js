module.exports = (error, req, res, next) => {
    const { statusCode, message } = error;
    res.status(statusCode || 500).send({ 'message': message || 'Internal server error' });
}