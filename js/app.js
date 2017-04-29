'use strict'

const config = require ('./config.js');
const Twit = require('twit');
const express = require('express');
const app = express();
const T = new Twit(config);


app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

app.get('/', (req, res) => {
  const tweets = T.get('statuses/user_timeline', {screen_name: 'r_osto', count: 5}, function(err, data, response){
    return data;
  })

  console.log(tweets);
  //res.render(index.pug);
  res.send('cool!');
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
