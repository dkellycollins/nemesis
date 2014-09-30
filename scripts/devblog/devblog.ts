///<reference path="../lib/jquery.d.ts" />
///<reference path="../lib/require.d.ts" />
///<reference path="../lib/markdown.d.ts" />

interface BlogPost {
    Title: string;
    DatePosted: string;
    Author: string;
    Content: string;
}

require.config({
    waitSeconds: 2,
    baseUrl: 'scripts/lib',
    paths: {
        blog: "../devblog",
        latest_blog: "../devblog/01.json"
    }
});

define((require) => {
    var $: JQueryStatic = require("jquery");
    //var markdown: markdown = require("markdown");
    var postName = 'json!' + (window.location.hash || 'latest_blog');
    require([postName], (post: BlogPost) => {
        $('#title').text(post.Title);
        $('#author').text(post.Author);
        $('#date').text(post.DatePosted);
        $('#post').html(markdown.toHTML(post.Content));
    });
});