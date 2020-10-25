'use strict';

const btc = require('bloom-text-compare');
const config = require('config');
const Article = require('../models/Article');

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-zA-Z ]/g, '');

const toList = (text) => normalize(text).split(' ');

const get = async (req, res, next) => {
  try {
    const text = 'It is an example text number two';
    const list = toList(text);
    const hash = btc.hash(list);

    const articles = await Article.find();

    const filtered = articles.filter((article) => {
      return btc.compare(hash, article.hash) >= config.get('THRESHOLD')
    })

    res.json(filtered);
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
    const resultArticle = await article.save();
    const articles = await Article.find();
    const filtered =
      articles.filter((el) => {
        return btc.compare(hash, el.hash) >= config.get('THRESHOLD')
          && el._id.toString() !== resultArticle._id.toString()
      }).map(el => el._id);

    res.json({
      id: resultArticle._id,
      content: resultArticle.content,
      duplicate_article_ids: filtered
    });
  } catch (err) {
    return next(err);
  }

};

const getById = (req, res, next) => {

};

module.exports.get = get;
module.exports.post = post;
module.exports.getById = getById;