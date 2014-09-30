///<reference path="../lib/jquery.d.ts" />
///<reference path="../lib/require.d.ts" />
///<reference path="../lib/markdown.d.ts" />

interface BlogPost {
    Title: string;
    DatePosted: string;
    Content: string;
}

require.config({
    baseUrl: 'scripts/lib',
    paths: {
        blog: "../devblog",
        latest_blog: "../devblog/01.json"
    }
});

define((require) => {
    var $: JQueryStatic = require("jquery");
    //var markdown: markdown = require("markdown");
    var post: BlogPost = require("json!latest_blog");

    $('#title').text(post.Title);
    $('#post').html(markdown.toHTML(post.Content));
});