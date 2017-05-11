var express = require('express'),
    router = express.Router();

var is = require('../my_modules/auth');

// get index/dashboard page
router.get('/', is.ensureAuth, function (req, res) {
   res.render('index')
});

module.exports = router;