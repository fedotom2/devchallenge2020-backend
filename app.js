'use strict';

const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const api = require('./api.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', api);
app.use(errorhandler());

const start = async () => {
  try {
    await mongoose.connect(config.get('MONGOURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true
    });

    const PORT = config.get('PORT') || 8000;
    app.listen(PORT, () => console.log(`Listening on port ${ PORT }`));
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
