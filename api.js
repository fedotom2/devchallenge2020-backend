'use strict';

const { Router } = require('express');
const router = Router();

router.get('/articles', require('./controllers/articles').get);
router.post('/articles', require('./controllers/articles').post);
router.get('/articles/:id', require('./controllers/articles').getById);
router.get('/duplicate_groups', require('./controllers/duplicate_groups').get);

module.exports = router;