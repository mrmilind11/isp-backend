const mongoose = require('mongoose');
const ErrorHandler = require('../utils/errorHandler');
module.exports = function () {
    const dbPath = `mongodb+srv://sharmajs11:${process.env.mongoDbPw}@cluster0-yprwh.mongodb.net/test?retryWrites=true&w=majority`
    mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        .then(() => {
            console.log('Connected to mongoDB');
        }, (error) => {
            console.log(error);
        });
}