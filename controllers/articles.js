'use strict';

const btc = require('bloom-text-compare');
const Article = require('../models/Article');

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-zA-Z ]/g, '');

const toList = (text) => normalize(text).split(' ');

const get = async (req, res, next) => {
  try {
    const text = 'It is an example text number two';
    const list = toList(text);
    const hash = btc.hash(list);

    const articles = await Article.find({
      '$expr': {
        '$function': {
          body: (hash2) => {
            return btc.compare(hash, hash2) >= 0.7
          },
          args: ['$hash'],
          lang: 'js'
        }
      }
    });

    res.json(articles);
  } catch (err) {
    return next(err);
  }
};

const post = async (req, res, next) => {
  try {
    const { content } = req.body;
    const list = toList(content);
    const hash = btc.hash(list);

    const article = new Article({ content, hash });

    const result = await article.save();

    res.json(result);
  } catch (err) {
    return next(err);
  }

};

const getById = (req, res, next) => {

};

module.exports.get = get;
module.exports.post = post;
module.exports.getById = getById;