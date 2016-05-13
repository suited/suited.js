'use strict';
// node.js, "classic" way:
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
var result = md.render('# markdown-it rulezz!');
console.log("result is " + result);
