var blogPost = window.location.hash;

define(function (require) {
    var $ = require("jquery");
    var post = require(blogPost);

    $('title').Text(post.Title);
    $('post').Text(post.Content);
});
//# sourceMappingURL=devblog.js.map
