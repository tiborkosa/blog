const express = require('express');
const app = express();
const api = require('./api');
const auth = require('./authenticate');
const mongoose = require('mongoose');
const {mongo} = require('./config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongo);
require('./middleware')(app);

app.use('/api',api);
app.use('/auth', auth);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message
    });
});
module.exports = app;
