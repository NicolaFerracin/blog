module.exports = (poet) => {
    poet.addRoute('/', (req, res, next) => {
        const posts = poet.helpers.getPosts();
        res.render('blog', { posts: posts, title: 'Blog' });
    });

    poet.addRoute('/blog/post/:post', (req, res, next) => {
        const post = poet.helpers.getPost(req.params.post);
        res.render('index', { post: post, page: 'blog' });
    });

    poet.addRoute('/blog/tag/:tag', (req, res, next) => {
        const posts = poet.helpers.postsWithTag(req.params.tag);
        res.render('blog', { posts: posts, page: 'blog', title: `Posts with tag: ${req.params.tag}` });
    });
};