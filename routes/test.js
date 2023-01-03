//redirect to another page with error message in __express.js?
app.get('/', interiorFunction, function (req, res, next) {
  res.render('homepage');
});

function interiorFunction(req, res, next) {
  let cat = 11;

  try {
    if (cat === 11) throw new Error('cat should not be 10');
    next();
  } catch (error) {
    return next(error);
  }
}



app.get('/', function (req, res, next) {
  const ok = interiorFunction(next);
  if (ok) {
    res.render('homepage');
  }
});

function interiorFunction(next) {
  let cat = 11;

  try {
    if (cat === 11) throw new Error('cat should not be 10');
    return true;
  } catch (error) {
    next(error);
    return false;
  }
}

// custom error handler
app.use(function (error, req, res, next) {
  let filePath = path.join(__dirname, '/error-pages/400.html');
  res.status(400).sendFile(filePath);
});



app.get('/', function (req, res, next) {
  try {
    interiorFunction();
    res.render('homepage');
  } catch (error) {
    console.log(error);
    next(error);
  }
});

function interiorFunction() {
  let cat = 11;

  if (cat === 11) throw new Error('cat should not be 10');
}



