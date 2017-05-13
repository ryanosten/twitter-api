'use strict'

const express = require('express');
const app = express();
const routes = require('./routes/index');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  err.message = "The page you are looking for has taken a permanent vacation. Try another page.";
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
  });
});

/*
app.use((req, res) => {
  const err = new Error('Whoops, looks like you requested has left and gone away. Try another page!');
  res.render('error', {error: err});
})
*/

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
