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

info.get('/', (req, res) => {
    console.log('test route running')
    const status = {
        'Status': "Running"
    };
    res.send(status, 'running well here in test file');
});


module.exports = info;
