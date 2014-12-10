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
    paths: {
        blog: "../devblog",
        jquery: "../lib/jquery.js",
        remarkable: "../lib/remarkable.js"
    }
});

define((require) => {
    var $: JQueryStatic = require('jquery');
    var remarkable = require('remarkable');
    var index = require('json!blog/index.json');

    var $nav = $('#nav');
    var postLinkTemplate = '<li><a href="{{id}}">{{title}}</a></li>';
    index.posts.forEach((postIndex) => {
        $nav.append(postLinkTemplate
            .replace('{{id}}', postIndex.id)
            .replace('{{title}}', postIndex.title)
        );
    });

    var md = new remarkable();
    var loadPost = () => {
        var postName = window.location.hash || index.latestPost;
        postName = postName.replace('#', ''); //Remove hash from the name.
        postName = 'blog/' + postName + '.json'; //Add blog path to the name.

        require(['json!' + postName], (post: BlogPost) => {
            $('#title').text(post.Title || '');
            $('#author').text(post.Author || '');
            $('#date').text(post.DatePosted || '');
            $('#post').html(md.render(post.Content));
        });
    };

    window.onhashchange = () => {
        loadPost();
    };
    loadPost();
});