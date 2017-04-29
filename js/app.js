'use strict'

const T = require('./config.js');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.render(index.pug);
});

app.listen(3000, () => {
  console.log("The frontend server is running on port 3000!");
});
