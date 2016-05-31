'use strict';
//state.js
/**
 * The state of the system. Supports the Suited framework and keep track of the current slide and mode
 * and allos the state to be manipulated.
 * 
 * @returns {Object}   Containing the functions necessary to check and manipulate the state
 */

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
var Mode = function (modeName, fnBeforeSlideChange, fnAfterSlideChange, fnBeforeModeChange, fnAfterModeChange, fnCleanUp, fnShouldShowslide) {

  var self = this;

  if (!modeName) {
    throw "Could not instansiate mode. Mode name is not optional."
  }

  this.name = modeName;

  this.beforeSlideChange = function (slideId) {
    if (fnBeforeSlideChange) {
      return fnBeforeSlideChange(slideId);
    } else {
      console.debug("No before slide change function defined for mode: " + name);
    }
  };

  this.afterSlideChange = function (slideId) {
    if (fnAfterSlideChange) {
      return fnAfterSlideChange(slideId);
    } else {
      console.debug("No after slide change function defined for mode: " + name);
    }
  };

  this.beforeModeChange = function (oldmode, newmode) {
    if (fnBeforeModeChange) {
      return fnBeforeModeChange(oldmode, newmode);
    } else {
      console.debug("No after mode change function defined for mode: " + name);
    }
  };

  this.afterModeChange = function (oldmode, newmode) {
    if (fnAfterModeChange) {
      return fnAfterModeChange(oldmode, newmode);
    } else {
      console.debug("No after mmode change function defined for mode: " + name);
    }
  };

  this.cleanUp = function () {
    if (fnCleanUp) {
      return fnCleanUp();
    } else {
      console.debug("No clean up function defined for mode: " + name);
    }
  };
    
  this.shouldShowSlide = function (slideType) {
      if (fnShouldShowslide) {
          return fnShouldShowslide(slideType);
      }
      else {
          console.debug("No slide type selection function. Showing all slides.");
          return true;
      }
  }

};

module.exports = Mode;
