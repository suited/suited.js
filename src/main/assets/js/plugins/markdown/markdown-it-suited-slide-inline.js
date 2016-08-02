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



// Process ~~:a suited figure goes here:~~ inline in markdown text

'use strict';

module.exports = function suitedfigure_plugin(md) {
  // make the token symbols variables so I can get them from state.md.config if necessary.
  var startToken = "~~*";
  var endToken = "*~~";

  function tokenize(state, silent) {
    var token,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);


    // start token = ~~:
    // end token = :~~
    // therfore
    var tokenlength = startToken.length;

    if (start + 1 > max) {
      return false;
    }
    if (silent) {
      return false;
    } // don't run any pairs in validation mode

    /* example inline figure:-   ~~:some figure stuff:~~ */
    // look for stating marker ~~:
    if (marker === startToken.charCodeAt(0) /* ~ */ &&
      state.src.charCodeAt(start + 1) === startToken.charCodeAt(1) /* ~ */ &&
      state.src.charCodeAt(start + 2) === startToken.charCodeAt(2) /* * */
    ) {
      state.scanDelims(state.pos, true);
      token = state.push('suitedfigureinline_open', 'section', 0);
      token.content = startToken;
      state.delimiters.push({
        marker: token.content,
        jump: 0,
        token: state.tokens.length - 1,
        level: state.level,
        end: -1,
        open: true,
        close: false
      });
    }
    /* look for stating marker :~~ */
    else if (marker === endToken.charCodeAt(0) /* * */ &&
      state.src.charCodeAt(start + 1) === endToken.charCodeAt(1) /* ~ */ &&
      state.src.charCodeAt(start + 2) === endToken.charCodeAt(2) /* ~ */
    ) {
      // found the close marker
      state.scanDelims(state.pos, true);
      token = state.push('suitedfigureinline_close', 'section', 0);
      token.content = endToken;
      state.delimiters.push({
        marker: token.content,
        jump: 0,
        token: state.tokens.length - 1,
        level: state.level,
        end: -1,
        open: false,
        close: true
      });
    } else {
      // neither
      return false;
    }

    state.pos += tokenlength;

    return true;
  }


  // Walk through delimiter list and replace text tokens with tags
  //
  function postProcess(state) {
    var i,
      foundStart = false,
      foundEnd = false,
      delim,
      token,
      delimiters = state.delimiters,
      max = state.delimiters.length;

    for (i = 0; i < max; i++) {
      delim = delimiters[i];
      if (delim.marker === startToken) {
        foundStart = true;
      } else if (delim.marker === endToken) {
        foundEnd = true;
      }
    }
    if (foundStart && foundEnd) {
      for (i = 0; i < max; i++) {
        delim = delimiters[i];

        if (delim.marker === startToken) {
          foundStart = true;
          token = state.tokens[delim.token];
          token.type = 'suitedslideinline_open';
          token.tag = 'section';
          token.nesting = 1;
          token.markup = '~~:';
          token.content = '';
          token.attrs = [['class', 'inline'], ['data-figure']];
        } else if (delim.marker === ':~~') {
          if (foundStart) {
            token = state.tokens[delim.token];
            token.type = 'suitedslideinline_close';
            token.tag = 'section';
            token.nesting = -1;
            token.markup = endToken;
            token.content = '';
          }
        }
      }
    }
  }

  md.inline.ruler.before('strikethrough', 'suitedslideinline', tokenize);
  md.inline.ruler2.before('strikethrough', 'suitedslideinline', postProcess);
};
