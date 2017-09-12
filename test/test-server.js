'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);
describe('Blog Post', function(){
  before(function(){
    return runServer();
  });
  after(function(){
    return closeServer();
  });
  it('should list blog on GET', function(){
    return chai.request(app)
      .get('/blogPosts')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item){
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add an item on POST', function() {
    const newBlogPost = {title: "Eric's Blog Post", author: "Eric P", content: "It is warm and sunny out today"};
    const firstPublishDate = Date.now()
    return chai.request(app)
    .post('/blogPosts')
    .send(newBlogPost)
    .then(function(res) {
      const secondPublishDate = Date.now()
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.include.keys("id", "title", "content", "author", "publishDate");
      res.body.id.should.not.be.null;
      // assuming all clocks in sync, monotomoic clock.
      res.body.publishDate.should.be.within(firstPublishDate, secondPublishDate)
      res.body.should.deep.equal(Object.assign(newBlogPost, {id: res.body.id}, {publishDate: res.body.publishDate}))
    })
  })

  it('should update items on PUT', function () {
    const updateData= {
    title: "eric's NEW blog post", 
    content: "uhhh here's stuff", 
    author: "ERICCC", 
    publishDate: Date.now()}

    return chai.request(app)
    .get('/blogPosts')
    .then(function(res) {
      updateData.id = res.body[0].id;
      return chai.request(app)
        .put(`/blogPosts/${updateData.id}`)
        .send(updateData);
    })
    .then(function(res) {
      res.should.have.status(204);
    })
  })

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/blogPosts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blogPosts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      })
  })

});