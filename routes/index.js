var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, err) {
  res.send('Hello world ! Coucou');
});

module.exports = router;
