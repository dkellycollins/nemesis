var blogPost = window.location.hash;

interface BlogPost {
    Title: string;
    DatePosted: string;
    Content: string;
}

define((require) => {
    var $: jquery = require("jquery");
    var post: BlogPost = require(blogPost);

    $('title').Text(post.Title);
    $('post').Text(post.Content);
});