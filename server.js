'use strict';

const express = require('express');
// const router = express.Router();
const morgan = require('morgan');
const app = express();

const blogPostsRouter = require('./blogPostsRouter');

app.use('/blogPosts', blogPostsRouter);



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
