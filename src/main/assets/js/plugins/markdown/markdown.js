'use strict';

var MarkdownIt = require('markdown-it');
var konfig = require('../../konfig.js')
var utils = require('../../utils.js');
var State = require('../../state.js');
var Dispatch = require('../../dispatch.js');
var Plugin = require('../../plugin.js');


//Listens to the 
var markdownPlugin = new Plugin("slideChangePlugin");

var vHandler = function (v) {
  if (v.value !== 0) console.error("markdownPlugin failed!!! ");
  else console.log("markdownPlugin succeeded");
}

markdownPlugin.addCallback("PluginsLoaded", function () {
  console.log("markdownPlugin: parsing document");

  // node.js, "classic" way:

  //get all elements with data-markdown attribute
  var nodeList = utils.selects("*[data-markdown]");
  
  var md = new MarkdownIt()
    .use(require("./markdown-it-suited-figure-block.js"))
    .use(require("./markdown-it-suited-slide-block.js"))
    .use(require("./markdown-it-suited-figure-inline.js"))
    .use(require("./markdown-it-suited-slide-inline.js"));

  for (var i = 0; i < nodeList.length; ++i) {
    var markedup = md.render(nodeList[i].innerHTML);
    nodeList[i].innerHTML = markedup;
  }

  console.log("markdownPlugin: parsed:- " );

  // node.js, the same, but with sugar:
  //  var md = require('markdown-it')();
  //  var result = md.render('# markdown-it rulezz!');



  return {
    'value': 0
  };
}, vHandler)


module.exports = markdownPlugin;
