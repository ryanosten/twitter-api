'use strict'

const express = require('express');
const app = express();
const home = require('./routes/home');
const postTweet = require('./routes/post-tweet')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

app.use('/', home);

app.post('/', postTweet);

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
