'use strict';

const btc = require('bloom-text-compare');
const config = require('config');
const Article = require('../models/Article');

const normalize = (text) =>
  text.toLowerCase().replace(/[^a-zA-Z ]/g, '');

const toList = (text) => normalize(text).split(' ');

// GET /articles
const get = async (req, res, next) => {
  try {
    const articles = await Article.find();
    const uniques = [ articles[0] ];
    const answer = [];

    for (let article of articles) {
      let counter = 0;
      for (let unique of uniques) {
        if (article._id.toString() === unique._id.toString())
          break;

        const distance = btc.compare(article.hash, unique.hash);
        if (distance < config.get('THRESHOLD'))
          counter++;
      }

      if (uniques.length === counter)
        uniques.push(article);

      counter = 0;
    }

    for (let unique of uniques) {
      const filtered =
        articles.filter((el) => {
          return btc.compare(unique.hash, el.hash) >= config.get('THRESHOLD')
            && el._id.toString() !== unique._id.toString()
        }).map(el => el._id);

      answer.push({
        id: unique._id,
        content: unique.content,
        duplicate_article_ids: filtered
      });
    }

    res.json({ articles: answer });
  } catch (err) {
    return next(err);
  }
};

// POST /articles
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

// GET /articles/:id
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    const articles = await Article.find();
    const filtered =
      articles.filter((el) => {
        return btc.compare(article.hash, el.hash) >= config.get('THRESHOLD')
          && el._id.toString() !== article._id.toString()
      }).map(el => el._id);

    res.json({
      id: article._id,
      content: article.content,
      duplicate_article_ids: filtered
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.get = get;
module.exports.post = post;
module.exports.getById = getById;