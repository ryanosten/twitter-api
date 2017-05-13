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

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
