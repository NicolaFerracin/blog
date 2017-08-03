const express = require('express');
const dotenv = require('dotenv');
const helpers = require('./helpers');
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
const cacheTime = 60*60*24*1000*7; // 7 days

// App setup
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use('/css', express.static(__dirname + '/css', { maxAge: cacheTime }));
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.currentPath = req.path;
  next();
});

// Poet setup
const Poet = require('poet');
const poet = Poet(app, {
  posts: __dirname + '/_posts',
  metaFormat: 'json'
});
poet.watch().init();
require('./routes/poet.js')(poet);

app.listen(port, () => {
  console.log('App listening on port', port);
});