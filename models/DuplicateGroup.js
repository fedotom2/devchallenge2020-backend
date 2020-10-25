'use strict';

const { Scheme, model, Types } = require('mongoose');
const ObjectId = Types.ObjectId;

const scheme = new Scheme({
  group: { type: [ObjectId] }
});

module.exports = model('DuplicateGroup', scheme);