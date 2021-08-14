const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('guest-home')
});

router.get('/about', function(req, res) {
    res.send('About Page');
});

module.exports = router;