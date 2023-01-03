var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/connection').connect()
var fileUpload = require('express-fileupload')
var bcrypt = require('bcrypt')
const session = require("express-session");

var indexRouter = require('./routes/index');
var signUpRouter = require('./routes/user/signup');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin/admin');
var userRouter = require('./routes/user/user');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use(
  session({
    secret: ",mysecretkey",
    resave: true,
    saveUninitialized: false,
    cookie: {
      expires: 360000,
    },
  })
);

app.use(function(req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use('/signup', signUpRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
