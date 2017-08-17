const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const helpers = require('./helpers');
const json = require('./json');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
const cacheTime = 60*60*24*1000*7; // 7 days

// App setup
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(cors());
app.use('/css', express.static(__dirname + '/css', { maxAge: cacheTime }));
app.use('/images', express.static(__dirname + '/images', { maxAge: cacheTime }));
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

app.get('/api/:name', (req, res) => {
  res.send(json.getJson([req.params.name]));
});

app.listen(port, () => {
  console.log('App listening on port', port);
});
