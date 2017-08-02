module.exports = (app) => {
  app.get('/', (req, res) => res.render('index', { page: 'home' }));

  // Catch all
  app.get('/*', (req, res) => res.redirect('/'));

};