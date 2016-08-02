/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   Karl_Roberts
* @Last modified time: 2016-Aug-02
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
