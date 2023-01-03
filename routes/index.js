var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/user')
  } else if (req.session.admin) {
    res.redirect('/admin')
  }
  else {
    res.render('index', { title: 'Login' });
  }
});


module.exports = router;
