'use strict';

const btc = require('bloom-text-compare');
const config = require('config');
const Article = require('../models/Article');

const arrayEquals = (arr1, arr2) => {
  if (arr1.length === arr2.length) {
    for (let i = 0; i < arr1.length; i++)
      if (arr1[i] !== arr2[i])
        return false;
  } else {
    return false;
  }

  return true;
}

const arrayFilter = (arr) => {
  const result = [];
  for (let i = 1; i < arr.length; i++)
    if (!arrayEquals(arr[i-1], arr[i]))
      result.push(arr[i]);

  return result;
};

// GET /duplicate_groups
const get = async (req, res, next) => {
  try {
    const articles = await Article.find();
    let groups = [];

    for (let article1 of articles) {
      const group = [];
      for (let article2 of articles) {
        if (article1._id.toString() === article2._id.toString())
          continue;

        const distance = btc.compare(article1.hash, article2.hash);
        if (distance >= config.get('THRESHOLD')) {
          if (group.length === 0)
            group.push(article1._id);

          group.push(article2._id);
        }
      }

      groups.push(group);
    }

    groups = groups.map(group => group.sort()).sort();
    groups = arrayFilter(groups);

    res.json({
      duplicate_groups: groups
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.get = get;
