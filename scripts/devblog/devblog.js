///<reference path="../lib/jquery.d.ts" />
///<reference path="../lib/require.d.ts" />
///<reference path="../lib/markdown.d.ts" />

require.config({
    waitSeconds: 2,
    baseUrl: 'scripts/lib',
    paths: {
        blog: "../devblog",
        latest_blog: "../devblog/01.json"
    }
});

var loadPost = function () {
    var postName = window.location.hash;
    if (!!postName) {
        postName = postName.replace('#', ''); //Remove hash from the name.
        postName = 'blog/' + postName + '.json'; //Add blog path to the name.
    } else {
        postName = 'latest_blog';
    }

    require(['jquery', 'json!' + postName], function ($, post) {
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
//# sourceMappingURL=devblog.js.map
