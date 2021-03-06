'use strict'

const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require ('../config.js');
const T = new Twit(config);

//stores username provided in terminal when app started. To start app use "node src/app.js {username}"
const username = process.argv[2];

//handle get requests to '/' route
router.get('/', (req, res) => {

  //open stream for tweets
  const stream = T.stream('user');

  //when tweet received in stream, emit tweet event tweet to client via websocket
  stream.on('tweet', function(tweet){
    if (tweet.user.screen_name == username) {
      req.io.emit('tweet', tweet);
    }
  });

  //construct promise to get tweets using Twit
  const tweetsPromise = T.get('statuses/user_timeline', {screen_name: username, count: 5});

  //construct promise to get friends list
  const friendsPromise = T.get('friends/list', {screen_name: username, count: 5});

  //construct promise to get previous direct messages
  const messagesPromise = T.get('direct_messages', {count: 5});

  //make promise array to pass into Promise.all() function
  const promiseArray = [tweetsPromise, friendsPromise, messagesPromise];

  //Handle all promise data yay!
  Promise.all(promiseArray).then( (promisesResolvedArray) => {
    //store the promise results
    let tweetData = promisesResolvedArray[0].data;
    let friendsData = promisesResolvedArray[1].data;
    let messages = promisesResolvedArray[2].data;

    //store data about the user to use in template
    let users = tweetData[0].user;
    //construct a tweets object
    let tweets = {};

    //loop through tweetData and grab important key/values
    for (let item of tweetData){
      let tweet_key = `tweet${tweetData.indexOf(item)}`;
      //add objects to tweets variable
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

    //store users key in friendsData in friends variable
    let friends = friendsData.users;

    //render template
    res.render('index', { users: users,
                          tweets: tweets,
                          friends: friends,
                          messages: messages
                        });
  //catch errors
  }).catch( (err) => {
    let error = new Error(err);
    res.send(error);
  });
});

//handle post requests
router.post('/', (req, res) => {

  //store body.message of request
  let tweet = req.body.message;

  //make post request to twitter with Twit
  T.post('/statuses/update', {status: tweet});

  res.end();

});

module.exports = router;
