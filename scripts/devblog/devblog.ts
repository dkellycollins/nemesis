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

var loadPost = () => {
    var postName = window.location.hash;
    if(!!postName) { //postname was provided.
        postName = postName.replace('#', ''); //Remove hash from the name.
        postName = 'blog/' + postName + '.json'; //Add blog path to the name.
    } else { //post name was not provided. use the default.
        postName = 'latest_blog';
    }

    require(['jquery', 'json!' + postName], ($: JQueryStatic, post: BlogPost) => {
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