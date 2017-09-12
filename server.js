const express = require('express');
// const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

// const blogPostData = require('./blogPosts');

BlogPosts.create("Ben's Blog Post", "I went to Islands of Adventure this weekend and went to Harry Potter World. It was really fun.", "Ben Malin");

app.get('/blogPosts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blogPosts', jsonParser, (req, res) => {
  const requiredFields = ["title", "content", "author"];
  for (let i=0; i<requiredFields.length; i++) {
    const field= requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(post);
});

app.delete('/blogPosts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.id}\``);
  res.status(204).end();
})

app.put('/blogPosts/:id', jsonParser, (req, res) => {
  const requiredFields = ["id", "title", "content", "author"];
  for (let i=0; i<requiredFields.length; i++) {
    const field= requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id){
  const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
  console.error(message);
  return res.status(400).send(message);
  }
console.log(`updating blog post \`${req.params.id}\``);
BlogPosts.update({
  id: req.params.id,
  title: req.body.title, 
  content: req.body.content,
  author: req.body.author
  })
res.status(204).end();
})

let server;
function runServer(){
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Ypur app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err);
    });
  });
}

function closeServer(){
  return new Promise((resolve, reject) => {
    console.log('closing server');
    server.close(err => {
      if (err){
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module){
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};


// app.listen(process.env.PORT || 8080, () => {
//   console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
// });
