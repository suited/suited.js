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

module.exports = function suitedfigureblock_plugin(md, theAlt) {

  function suitedfigureblock(state, startLine, endLine, silent) {
    var marker, len, params, nextLine, mem, token, token2, markup,
      haveEndMarker = false;
    var pos = state.bMarks[startLine] + state.tShift[startLine]; // first char pos in current line
    var max = state.eMarks[startLine]; // last char pos in the line

    //??? WTF is this
//    if (pos + 3 > max) {
//      return false;
//    }

    marker = state.src.charCodeAt(pos);

    // make the token symbols variables so I can get them from state.md.config if necessary.
    var startToken = "~~:";
    var endToken = ":~~";

    var seenStart = false;
    var seenEnd = false;

    function foundStart(startPos) {
      // first 3 char at startPos in src match m token TODO is String.startswith or subsctring faster?
//      console.log("dddddddd1 startToken.charAt(0)= " + startToken.charCodeAt(0) + "  charCodeAt(startPos) = " + state.src.charCodeAt(startPos));
//      console.log("dddddddd2 startToken.charAt(1)= " + startToken.charCodeAt(1) + "  charCodeAt(startPos+1) = " + state.src.charCodeAt(startPos + 1));
//      console.log("dddddddd3 startToken.charAt(2)= " + startToken.charCodeAt(2) + "  charCodeAt(startPos+2) = " + state.src.charCodeAt(startPos + 2));
      var ret = (state.src.charCodeAt(startPos) === startToken.charCodeAt(0) /* ~ */ &&
        state.src.charCodeAt(startPos + 1) === startToken.charCodeAt(1) /* ~ */ &&
        state.src.charCodeAt(startPos + 2) === startToken.charCodeAt(2) /* : */
      )
//      console.log("dddddddd4 ret = " + ret);
      return ret
    }

    function foundEnd(startPos) {
//      console.log("zzzzzzz endToken.charAt(0)= " + endToken.charCodeAt(0) + "  charCodeAt(startPos) = " + state.src.charCodeAt(startPos));
//      console.log("zzzzzzz endToken.charAt(1)= " + endToken.charCodeAt(1) + "  charCodeAt(startPos+1) = " + state.src.charCodeAt(startPos + 1));
//      console.log("zzzzzzz endToken.charAt(2)= " + endToken.charCodeAt(2) + "  charCodeAt(startPos+2) = " + state.src.charCodeAt(startPos + 2));
      // first 3 char at startPos in src match m token TODO is String.startswith or subsctring faster?
      var ret = (state.src.charCodeAt(startPos) === endToken.charCodeAt(0) /* : */ &&
        state.src.charCodeAt(startPos + 1) === endToken.charCodeAt(1) /* ~ */ &&
        state.src.charCodeAt(startPos + 2) === endToken.charCodeAt(2) /* ~ */
      )
//      console.log("zzzzzzz ret = " + ret);
      return ret;
    }

    if (foundStart(pos)) {
      // start marker
      seenStart = true;
    } else {
      return false; //quick exit
    }


    //

    // scan marker length
    mem = pos;
    //skip passed start token
    pos = pos + startToken.length + 1;

    len = startToken.length;

    markup = state.src.slice(mem, pos);
    params = state.src.slice(pos, max);


    // Since start and end is found, we can report success here in validation mode
    // early RETURN
    if (silent && foundStart /* && foundEnd */ ) {
      return true;
    }

    // search end of block
    nextLine = startLine;

    while (!seenEnd) {
      nextLine++;

      // skip blankstuff at beginning of line
      pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      if (foundEnd(pos)) {
          // start marker
          seenEnd = true;
        break;
        } else {
          // return false; //quick exit
        }

      if (nextLine >= endLine && !seenEnd) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
       // return false; // we are at the end of the src for this markup
        //lets see if we got lucky
        return false;
      }


    }

    // If a figure is indented ie has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];

    state.line = nextLine + (seenEnd ? 1 : 0);
    endLine = state.line;

    token = state.push('suitedfigureblock_open', 'section', 1);
    token.attrs = [ ['data-figure', '']];
    // token.info    = params; // I think s
    token.children = [];

    //IF we want a seperate div so we can style it differntly uncomment below or use magig option
//    token = state.push('block', 'div', 0);
    var theCOntent = state.getLines(startLine + 1, endLine - 1, len, true);
    console.log("jjjjjjjjjj cotheCOntentntent = " + theCOntent);
//    token.content = state.md.render(theCOntent);
    token.content = state.md.block.parse(theCOntent, state.md, state.env, state.tokens);
//    state.md.block.parse(theCOntent, state.md, state.env, state.tokens);
//    state.md.core.process(theCOntent, state.md, state.env, state.tokens);

    console.log("jjjjjjjjjj2 token.content = " + token.content);
    token.markup = startToken;
    token.map = [startLine, endLine];

    // FINALIZE
    token = state.push('suitedfigureblock_close', 'section', -1);
    token.markup = endToken;



    return true;
  };

  md.block.ruler.before('table', 'suitedfigureblock', suitedfigureblock);

}
