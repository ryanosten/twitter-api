'use strict'

const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser');

//use bodyParser to parse form post body
app.use(bodyParser.urlencoded({
  extended: true
}));

//setup pug templates
app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

//route handler for '/' route
app.use('/', routes);

//handle errors
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  err.message = "The page you are looking for has taken a permanent vacation. Try another page.";
  next(err);
});

//render error in template
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
