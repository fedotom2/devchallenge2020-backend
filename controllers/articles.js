'use strict';

const btc = require('bloom-text-compare');
const Article = require('../models/Article');

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-zA-Z ]/g, '');

const get = (req, res, next) => {

};

const post = async (req, res, next) => {
  const { content } = req.body;
  const list = normalize(content).split(' ');
  const hash = btc.hash(list);

  const article = new Article({ content, hash });

  const result = await article.save();

  res.json(result);
};

const getById = (req, res, next) => {

};

module.exports.get = get;
module.exports.post = post;
module.exports.getById = getById;