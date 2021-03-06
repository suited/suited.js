/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   robertk
* @Last modified time: 2016-Aug-11
* @License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/



'use strict';

var MarkdownIt = require('markdown-it');
var konfig = require('../../konfig.js')
var utils = require('../../utils.js');
var State = require('../../state.js');
var Dispatch = require('../../dispatch.js');
var Plugin = require('../../plugin.js');


//Listens to the
var markdownPlugin = new Plugin("MarkdownPlugin");

//set it with a default
var md = new MarkdownIt( {html: true})
  .use(require("./markdown-it-suited-figure-block.js"))
  .use(require("./markdown-it-suited-slide-block.js"))
  .use(require("./markdown-it-suited-figure-inline.js"))
  .use(require("./markdown-it-suited-slide-inline.js"));

var vHandler = function (v) {
  if (v.value !== 0) console.error("markdownPlugin failed!!! ");
  else console.log("markdownPlugin succeeded");
}

function parseDocument(){
  // node.js, "classic" way:
  console.log("markdownPlugin: parsing document");

  //get all elements with data-markdown attribute
  var nodeList = utils.selects("*[data-markdown]");

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
}

markdownPlugin.addCallback("MarkdownPlugin-ConfigMerged", function () {
  console.log("markdownPlugin: fixing config");
  //get config
   var myConf = markdownPlugin.config();
   if(!!window.suited.config.log && window.suited.config.debug)
   {
     console.log("<><<<><><><><<><>< MarkdownPlugin: myConf= "+ JSON.stringify(myConf,null,2))
   }
  var parseEmbededHTML = (!!myConf && !!myConf.html) ? myConf.html : false;

  //pas config to MarkdownIt
  md = new MarkdownIt( {html: parseEmbededHTML})
    .use(require("./markdown-it-suited-figure-block.js"))
    .use(require("./markdown-it-suited-slide-block.js"))
    .use(require("./markdown-it-suited-figure-inline.js"))
    .use(require("./markdown-it-suited-slide-inline.js"));

  return parseDocument();
}, vHandler)

markdownPlugin.addCallback("PluginsLoaded", parseDocument, vHandler)


module.exports = markdownPlugin;
