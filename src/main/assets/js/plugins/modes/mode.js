'use strict';
//mode.js
/**
 * The Mode manages the view of the document while it is active. Mode Extends Plugin so it can register with the
 * Dispatch to act on events.
 * The ModePlugin manages a Mode and will register and deregister it when the mode changes.
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

import Plugin from '../../plugin.js'

//TODO FIXME - karl - Should we allow the mode to add a callback for events for each of these functions when activated or have ModePlugin manage it
// or have mode plugin call these funcs as currently happens? My vote is to have a function that registers them with
// the Mode as a plugin then ModePlugin doesn't have to know anything, just manage register and deregister the Mode with the Dispatcher 
// on mode change. What do you think?
var Mode = function (modeName, fnBeforeSlideChange, fnAfterSlideChange, fnBeforeModeChange, fnAfterModeChange, fnCleanUp, fnShouldShowslide) {

  var self = this; //safekeeping
  
  if (!modeName) {
    throw "Could not instansiate mode. Mode name is not optional."
  }
  
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  Plugin.call(this, modeName);


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

// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
//
// Create a Mode.prototype object that inherits from Plugin.prototype.
// Note: A common error here is to use "new Plugin()" to create the
// Mode.prototype. That's incorrect for several reasons, not least 
// that we don't have anything to give Plugin for the "name" 
// argument. The correct place to call Plugin is above, where we call 
// it from Mode.
Mode.prototype = Object.create(Plugin.prototype); // See note below

// Set the "constructor" property to refer to Student
Mode.prototype.constructor = Mode;

module.exports = Mode;
