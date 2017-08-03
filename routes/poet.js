module.exports = (poet) => {
    poet.addRoute('/', (req, res, next) => {
        const posts = poet.helpers.getPosts();
        res.render('blog', { posts, title: 'Blog' });
    });

    poet.addRoute('/tag/:tag', (req, res, next) => {
        const posts = poet.helpers.postsWithTag(req.params.tag);
        res.render('blog', { posts, title: `Posts with tag:</br>${req.params.tag}` });
    });
};