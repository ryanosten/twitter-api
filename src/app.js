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

  const tweetsPromise = new Promise((resolve, reject) => {
      T.get('statuses/user_timeline', {screen_name: 'r_osto', count: 5}, function(err, data, response){
      resolve(data);
    });
  });

  const handlePromiseResults = function(data){
    const user = data[0].user;
    const tweets = {};

    for (let item of data){
      let tweet_key = `tweet${data.indexOf(item)}`;
      tweets[tweet_key] = {
                          text: item.text,
                          name: item.user.name,
                          username: item.user.screen_name,
                          user_image: item.user.profile_image_url_https,
                          retweet: item.retweet_count,
                          favorited: item.favorite_count
                          }
    }

    console.log(tweets);
    res.render('index', { user: user,});
  }

  const handlePromiseError = function(e){
    console.log(e);
  }

  tweetsPromise.then(handlePromiseResults).catch(handlePromiseError);

  //res.render('index');
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});

/*
{tweet_one: {text: data[0].text,
              name: data[0].user.name,
              username: data[0].screen_name,
              user_image: data[0].profile_image_url_https,
              retweet: data[0].retweet_count,
              favorited: data[0].favorite_count
            },
   tweet_two: {

            }
  }
  */
