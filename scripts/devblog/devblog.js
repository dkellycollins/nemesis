///<reference path="../lib/jquery.d.ts" />
///<reference path="../lib/require.d.ts" />
///<reference path="../lib/markdown.d.ts" />

require.config({
    baseUrl: 'scripts/lib',
    paths: {
        blog: "../devblog",
        latest_blog: "../devblog/01.json"
    }
});

define(function (require) {
    var $ = require("jquery");

    //var markdown: markdown = require("markdown");
    var post = require("json!latest_blog");

    $('#title').text(post.Title);
    $('#post').html(markdown.toHTML(post.Content));
});
//# sourceMappingURL=devblog.js.map
