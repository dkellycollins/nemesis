///<reference path="../lib/jquery.d.ts" />
///<reference path="../lib/require.d.ts" />
///<reference path="../lib/markdown.d.ts" />

require.config({
    waitSeconds: 2,
    baseUrl: 'scripts/lib',
    paths: {
        blog: "../devblog"
    }
});

define(function (require) {
    var $ = require('jquery');
    var index = require('json!blog/index.json');

    var $nav = $('#nav');
    var postLinkTemplate = '<li><a href="{{id}}">{{title}}</a></li>';
    index.posts.forEach(function (postIndex) {
        $nav.append(postLinkTemplate.replace('{{id}}', postIndex.id).replace('{{title}}', postIndex.title));
    });

    var loadPost = function () {
        var postName = window.location.hash || index.latestPost;
        postName = postName.replace('#', ''); //Remove hash from the name.
        postName = 'blog/' + postName + '.json'; //Add blog path to the name.

        require(['json!' + postName], function (post) {
            $('#title').text(post.Title || '');
            $('#author').text(post.Author || '');
            $('#date').text(post.DatePosted || '');
            $('#post').html(markdown.toHTML(post.Content) || '');
        });
    };

    window.onhashchange = function () {
        loadPost();
    };
    loadPost();
});
