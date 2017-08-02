const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
const cacheTime = 60*60*24*1000*7; // 7 days

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use('/css', express.static(__dirname + '/css', { maxAge: cacheTime }));

const Poet = require('poet');
const poet = Poet(app, {
  posts: __dirname + '/_posts',
  metaFormat: 'json'
});
require('./routes/poet.js')(poet);
poet.watch().init();

app.listen(port, () => {
  console.log('App listening on port', port);
});