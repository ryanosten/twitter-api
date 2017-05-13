'use strict'

const config = require ('./config.js');
const Twit = require('twit');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const T = new Twit(config);

app.use(bodyParser.urlencoded({
  extended: true
}));

//app.use(bodyParser.json());

app.use('/static', express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

app.get('/', (req, res) => {

  const tweetsPromise = T.get('statuses/user_timeline', {screen_name: 'r_osto', count: 5});

  //Promise for get friends list
  const friendsPromise = T.get('friends/list', {screen_name: 'r_osto', count: 5});

  const messagesPromise = T.get('direct_messages', {count: 5});

  const promiseArray = [tweetsPromise, friendsPromise, messagesPromise];

  Promise.all(promiseArray).then( (promisesResolvedArray) => {
    let tweetData = promisesResolvedArray[0].data;
    let friendsData = promisesResolvedArray[1].data;
    let messages = promisesResolvedArray[2].data;

    //handle tweetData
    let users = tweetData[0].user;
    let tweets = {};

    for (let item of tweetData){
      let tweet_key = `tweet${tweetData.indexOf(item)}`;
      tweets[tweet_key] = {
                          timestamp: item.created_at.substring(3, 16),
                          text: item.text,
                          name: item.user.name,
                          username: item.user.screen_name,
                          user_image: item.user.profile_image_url,
                          retweet: item.retweet_count,
                          favorited: item.favorite_count
                          }
    }

    //handle friendsData
    let friends = friendsData.users;

    res.render('index', { user: users,
                          tweets: tweets,
                          friends: friends,
                          messages: messages
                        })

  }).catch( (err) => {
    //catch errors
  });
});

app.post('/', (req, res) => {
    let tweet = req.body.message;

    T.post('/statuses/update', {status: tweet});

    const tweetsPromise = T.get('statuses/user_timeline', {screen_name: 'r_osto', count: 5});

    //Promise for get friends list
    const friendsPromise = T.get('friends/list', {screen_name: 'r_osto', count: 5});

    const messagesPromise = T.get('direct_messages', {count: 5});

    const promiseArray = [tweetsPromise, friendsPromise, messagesPromise];

    Promise.all(promiseArray).then( (promisesResolvedArray) => {
      let tweetData = promisesResolvedArray[0].data;
      let friendsData = promisesResolvedArray[1].data;
      let messages = promisesResolvedArray[2].data;

      //handle tweetData
      let users = tweetData[0].user;
      let tweets = {};

      for (let item of tweetData){
        let tweet_key = `tweet${tweetData.indexOf(item)}`;
        tweets[tweet_key] = {
                            timestamp: item.created_at.substring(3, 16),
                            text: item.text,
                            name: item.user.name,
                            username: item.user.screen_name,
                            user_image: item.user.profile_image_url,
                            retweet: item.retweet_count,
                            favorited: item.favorite_count
                            }
      }

      //handle friendsData
      let friends = friendsData.users;

      res.render('index', { user: users,
                            tweets: tweets,
                            friends: friends,
                            messages: messages
                          })

    }).catch( (err) => {
      //catch errors
    });


})

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
