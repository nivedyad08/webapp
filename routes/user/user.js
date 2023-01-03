var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
/* GET home page. */

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else if (req.session.admin) {
    next()
  }
  else {
    res.redirect('/login');
  }
}

router.get('/', verifyLogin, async function (req, res, next) {
  try{
    if (req.session.user) {
      let userDetails = await db.conn().collection('user').findOne({ email: req.session.user })
      res.render('user/home', { title: 'User Home', user: userDetails });
    } else if (req.session.admin) {
      res.render('admin/home', { title: 'Admin Home' });
    } else {
      res.redirect('/login')
    }
  }catch(e){
    return e
  }
 
});

router.get('/logout', function (req, res, next) {
  console.log('destroy', req.session.user)
  req.session.destroy()
  res.redirect('/login');
});
module.exports = router;
