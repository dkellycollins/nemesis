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
    var $: JQueryStatic = require('jquery');
    var index = require('json!blog/index.json');

    var $nav = $('#nav');
    var postLinkTemplate = '<li><a href="{{id}}">{{title}}</a></li>';
    index.posts.forEach((postIndex) => {
        $nav.append(postLinkTemplate
            .replace('{{id}}', postIndex.id)
            .replace('{{title}}', postIndex.title)
        );
    });

    var loadPost = () => {
        var postName = window.location.hash;
        if(!!postName) { //postname was provided.
            postName = postName.replace('#', ''); //Remove hash from the name.
            postName = 'blog/' + postName + '.json'; //Add blog path to the name.
        } else { //post name was not provided. use the default.
            postName = 'latest_blog';
        }

        require(['json!' + postName], (post: BlogPost) => {
            $('#title').text(post.Title || '');
            $('#author').text(post.Author || '');
            $('#date').text(post.DatePosted || '');
            $('#post').html(markdown.toHTML(post.Content) || '');
        });
    };

    window.onhashchange = () => {
        loadPost();
    };
    loadPost();
});