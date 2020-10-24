'use strict';

const { Schema, model } = require('mongoose');

const schema = new Schema({
  content: { type: String },
  hash: { type: [Number] }
});

module.exports = model('Article', schema);
