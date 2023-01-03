var express = require('express');
var router = express.Router();
const db = require('../config/connection')
const bcrypt = require('bcrypt')

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else if (req.session.admin) {
    next()
  }
  else {
    res.render('login', { title: 'Login' });
  }
}
/* GET home page. */
router.get('/', function (req, res, next) {

  if (req.session.user) {
    res.redirect('/user')
  } else if (req.session.admin) {
    res.redirect('/admin')
  }
  else {
    res.render('login', { title: 'Login' });
  }
});

router.post('/submitData', async (req, res) => {
  try{
    if (!req.session.user && !req.session.admin) {
      let user = await db.conn().collection('user').findOne({ email: req.body.email })
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, data) => {
          if (data) {
            if (user.role == 'user') {
              req.session.user = user.email;
              console.log('submit-login', req.session.user)
              res.redirect('/user')
            } else if (user.role == 'admin') {
              req.session.admin = user.email
              res.redirect('/admin')
            }
          } else {
            res.render('login', { title: 'Login', error_msg: "Invalid Credentials" });
          }
        })
      } else {
        res.render('login', { title: 'Login', error_msg: "Invalid Credentials" });
      }
    } 
    else redirect("/login")
  }catch(e){
    console.log(e);
    return e
  }
})

module.exports = router;
