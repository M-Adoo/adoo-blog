/**
 * Fix post permalink not overriding config permalink in Hexo v3.2.2
 * Add a `mypermalink: hello-example` to any post front-matter to override config.
 * Place this script in your project/scripts directory (project/scripts/hexo-post-permalink-fix.js)
 */
var permalink = require('hexo/lib/plugins/filter/post_permalink')

hexo.extend.filter.unregister('post_permalink', permalink);
hexo.extend.filter.register('post_permalink', function (data) {
    if (typeof data.override_permailink != "undefined") {
        return data.override_permailink + '.html';
    } else {
        return permalink.apply(this, [data])
    }
}, 9);