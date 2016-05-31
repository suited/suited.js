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

var utils = require('./utils.js');

/**
 * Nav constructor
 @param modePosTester {Function (int, mode) => boolean} 
 **/
function Nav(modePosTester, navigableNodes) {

  var self = this; //For the private methods

  // the nav structure
  var nav = {
    calcNextNum: function (start) {
      start = Number(start);
      
      //Just to be safe  
      if (start < 0) start = 0; 
        
      var next = start + 1;

      if (next >= navigableNodes.length) {
        return nav.calcPrevNum(start);          
      }
        
      var el = navigableNodes.item(next);
      var slideType = utils.typeSlide(el);        

      if (modePosTester(slideType)) {
        return next;
      } else {
        return nav.calcNextNum(next);
      }
    },
    /** recurs becwards loolin for a valid value for mode.
    @param start = starting num, usually s.currentNum */
    calcPrevNum: function (start) {
      start = Number(start);
      var prev = start - 1;

      if (start <= 0) {
        return 0;
      } else {
        var el = navigableNodes.item(prev);
        var slideType = utils.typeSlide(el);        
          
        if (modePosTester(slideType)) {
          return prev;
        } else {
          //recurse
          return nav.calcPrevNum(prev);
        }
      }
    }
  };

  //Expose the API
  this.calcNextNum = nav.calcNextNum;
  this.calcPrevNum = nav.calcPrevNum;
}


/** Export the module **/
module.exports = Nav; //export a Nav constructor
