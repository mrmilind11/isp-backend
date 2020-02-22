const express = require('express');

module.exports = (app) => {
    app.use('/images', express.static('public/images'));
}