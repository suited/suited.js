//nav.js module returns a Nav constructor function... use it with a new keyword
'use strict';

/*
Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com> 

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


var konstants = require('./konstantes.js');
var konfig = require('./konfig.js');
var utils = require('./utils.js');

var k = konstants;
var c = konfig;




/**
 * Nav constructor
 @param modePosTester {Function (int, mode) => boolean} 
 **/
function Nav(modes, modePosTester) {

  var self = this; //For the private methods

  // the nav structure
  var nav = {
    calcNextNum: function (start, mode) {
      start = Number(start);
      if (start < 0) start = 0; //fuck me
      var next = start + 1;

      // test we are not past the end of this mode
      if (modePosTester(start, mode) === undefined) {
        return nav.calcPrevNum(start, mode);
      }

      if (modePosTester(next, mode)) {
        return next;
      } else {
        return nav.calcNextNum(next, mode);
      }
    },
    /** recurs becwards loolin for a valid value for mode.
    @param start = starting num, usually s.currentNum */
    calcPrevNum: function (start, mode) {
      start = Number(start);
      var prev = start - 1;

      if (start <= 0) {
        return 0;
      } else {
        if (modePosTester(prev, mode)) {
          return prev;
        } else {
          //recurse
          return nav.calcPrevNum(prev, mode);
        }
      }
    }
  };

  // initialise the nav structure
  //  initNav(nav, modes);

  // populate the nav structure
  //  populateNavs(nav, navigableNodes)


  //Expose the API
  this.calcNextNum = nav.calcNextNum;
  this.calcPrevNum = nav.calcPrevNum;

  //for debugging
  this._nav = nav;
}


/** Export the module **/
module.exports = Nav; //export a Nav constructor
