'use strict';

const { Schema, model, Types } = require('mongoose');
const ObjectId = Types.ObjectId;

const schema = new Schema({
  group: { type: [ObjectId] }
});

module.exports = model('DuplicateGroup', schema);