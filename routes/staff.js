var express = require('express');
var router = express.Router();

//get staff method
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
