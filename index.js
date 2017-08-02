const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const Poet = require('poet');
const poet = Poet(app, {
  posts: __dirname + '/_posts',
  metaFormat: 'json'
});
require('./routes/poet.js')(poet);
poet.watch().init();

require('./routes/routes.js')(app);

app.listen(port, () => {
  console.log('App listening on port', port);
});