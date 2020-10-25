'use strict';

const assert = require('assert');
const request  = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Express application', () => {
  let firstId, secondId;

  describe('Articles controller', () => {
    // POST /articles
    it('should send back a JSON object with content set to current text and must be id and empty duplicate_article_ids fields', (done) => {
      request(app)
        .post('/articles')
        .set('Content-Type', 'application/json')
        .send({ content: 'Express application unit test example text' })
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err)
            return done(err);

          if (res.body.id && res.body.duplicate_article_ids) {
            firstId = res.body.id.toString();
            expect(res.body.content).to.equal('Express application unit test example text');
            done();
          }
        });
    });

    // POST /articles
    it('should send back a JSON object with content set to current text and must be id and duplicate_article_ids fields', (done) => {
      request(app)
        .post('/articles')
        .set('Content-Type', 'application/json')
        .send({ content: 'Express application unit test example text two' })
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err)
            return done(err);

          if (res.body.id && res.body.duplicate_article_ids) {
            secondId = res.body.id.toString();
            expect(res.body.duplicate_article_ids[0].toString()).to.equal(firstId);
            expect(res.body.content).to.equal('Express application unit test example text two');
            done();
          }
        });
    });

    // GET /articles/:id
    it('should send back a JSON object with content set to first text and must be id set to first id and duplicate_article_ids with second id', (done) => {
      request(app)
        .get('/articles/' + firstId)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err)
            return done(err);

          if (res.body.id && res.body.duplicate_article_ids) {
            expect(res.body.id.toString()).to.equal(firstId);
            expect(res.body.duplicate_article_ids[0].toString()).to.equal(secondId);
            expect(res.body.content).to.equal('Express application unit test example text');
            done();
          }
        });
    });

    // GET /articles
    it('should send back all unique articles without duplicates', (done) => {
      request(app)
        .get('/articles')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, (err, res) => {
          if (err)
            return done(err);

          if (res.body.articles) {
            const { articles } = res.body;
            const article = articles[articles.length - 1];
            if (article.id && article.content && article.duplicate_article_ids) {
              expect(article.id.toString()).to.equal(firstId);
              expect(article.content).to.equal('Express application unit test example text');
              expect(article.duplicate_article_ids[0].toString()).to.equal(secondId);
              done();
            }
          }
        });
    });
  });

  describe('Duplicate Groups controller', () => {

  });
});