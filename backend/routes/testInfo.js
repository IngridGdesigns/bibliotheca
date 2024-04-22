const express = require('express');

let info = express.Router(); //to create modular mountable route handlers

info.use(function(req, res, next) {
    res._json = res.json;
    res.json = function json(obj) {
        obj.apiVersion = 1;
        res._json(obj);
    }
    next();
})

info.get('/api/v1/info', (req, res) => {
    console.log('test route running')
    const status = {
        'Status': "Running"
    };
    res.send(status);
});

module.exports = info;
