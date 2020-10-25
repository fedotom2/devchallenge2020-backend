'use strict';

const DuplicateGroup = require('../models/DuplicateGroup')

// GET /duplicate_groups
const get = async (req, res, next) => {
  try {
    const duplicateGroups = await DuplicateGroup.find();
    const groups = duplicateGroups.map(el => el._id);

    res.json({
      duplicate_groups: groups
    });

  } catch (err) {
    return next(err);
  }
};

module.exports.get = get;
