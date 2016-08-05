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
//mode.js
/**
 * The Mode manages the view of the document while it is active. Mode Extends Plugin so it can register with the
 * Dispatch to act on events.
 * The ModePlugin manages a Mode and will register and deregister it when the mode changes.
 */
import konstants from '../../konstantes.js'
import Plugin from '../../plugin.js'

//TODO FIXME - karl - Should we allow the mode to add a callback for events for each of these functions when activated or have ModePlugin manage it
// or have mode plugin call these funcs as currently happens? My vote is to have a function that registers them with
// the Mode as a plugin then ModePlugin doesn't have to know anything, just manage register and deregister the Mode with the Dispatcher
// on mode change. What do you think?
/**
 *
 * arrTransitions: Array[{
     name:String,
     left:function(elementId:String),
     right:function(elementId:String),
     up:function(elementId:String),
     down:function(elementId:String)
   }]
 */
var Mode = function (modeName, fnBeforeSlideChange, fnAfterSlideChange, fnBeforeModeChange, fnAfterModeChange, fnCleanUp, fnShouldShowslide, arrTransitions) {

  var self = this; //safekeeping

  if (!modeName) {
    throw "Could not instansiate mode. Mode name is not optional."
  }

  // be sure to inherit from Plugin
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  Plugin.call(this, modeName);

  // Must be unique as it is the PluginName... this is not checked yet //TODO FIXME
  this.name = modeName;
  this.selectedTransition = undefined;

  //internal map of transitions name -> transitionObject that this Mode supports
  var transitions = {};



  // caution, at present this will ruthlessly overwtite a transition of the same name //TODO decide on policy
  this.addTransition = function (aTransition) {
    if (!!aTransition) {
      transitions[aTransition.name] = aTransition;
    }
  }

  //TODO FIXME should I make transitins be part of the constructor?

  this.removeTransition = function (name, transition) {
    if (!!name && !!transitions) {
      delete transitions[name];
    }
  }

  //Add transitions supplied
  if (!arrTransitions || arrTransitions.length === 0) {
    //set the default scroll transition
    self.addTransition(konstants.defaultTransitions.scroll);
  } else {
    arrTransitions = Array.prototype.slice.call(arrTransitions)
    arrTransitions.forEach(function (aTransition, i, a) {
      self.addTransition(aTransition)
    });
  }




  this.beforeSlideChange = function (slideId, state, evData) {
    if (fnBeforeSlideChange) {
      return fnBeforeSlideChange(slideId, state, evData);
    } else {
      console.debug("No before slide change function defined for mode: " + name);
    }
  };

  this.afterSlideChange = function (slideId, state, evData) {
    if (fnAfterSlideChange) {
      return fnAfterSlideChange(slideId, state, evData);
    } else {
      console.debug("No after slide change function defined for mode: " + name);
    }
  };

  this.beforeModeChange = function (state, evData) {
    if (fnBeforeModeChange) {
      return fnBeforeModeChange(state, evData);
    } else {
      console.debug("No before mode change function defined for mode: " + name);
    }
  };

  this.afterModeChange = function (state, evData) {
    if (fnAfterModeChange) {
      return fnAfterModeChange(state, evData);
    } else {
      console.debug("No after mmode change function defined for mode: " + name);
    }
  };

  this.cleanUp = function (state) {
    if (fnCleanUp) {
      return fnCleanUp(state);
    } else {
      console.debug("No clean up function defined for mode: " + name);
    }
  };

  this.shouldShowSlide = function (slideType) {
    if (fnShouldShowslide) {
      return fnShouldShowslide(slideType);
    } else {
      console.debug("No slide type selection function. Showing all slides.");
      return true;
    }
  }

  /**
   * find the correct transition function for the direction elementId and mode
   * first check the element for a clue ie look for attribute transition, then look at the suited.config object.
   * If we have a transition name...
   * then look at this mode to find the one. If we don't find one or no name is supplied then use transitions[0]
   **/
  this.findTransition = function (direction, elId) {

    // we need to hack a top for transitoion scroll or you can';t get to the top again

    var el = document.getElementById(elId);
    var defaultTransition = transitions[Object.keys(transitions)[0]];

    var tname = undefined;

    if (el && el.hasAttribute("transition")) {
      var attrV = el.getAttribute("transition");
      tname = (!!attrV) ? attrV : defaultModeTName;
    } else if(!!self.selectedTransition){
      tname = self.selectedTransition;
    }
    else if (window.suited.config.transition) {
      tname = window.suited.config.transition;
    }

    //we now know the tname so look it up
    var transition = transitions[tname];
    if (!transition) {
      transition = defaultTransition;
    }

    //return the transition func for this direction of transition
    return transition[direction];

  }

  //Add the callbacks that all Modes must have. //addCallback inherited from Plugin


this.addCallback("BeforeModeChange", function(state, evData){
    self.beforeModeChange(state, evData);

    return state;
});

this.addCallback("AfterModeChange", function(state, evData){
    self.afterModeChange(state, evData);

    return state;
});

  this.addCallback("BeforeSlideChange", function(state, evData){
      var slideId = state.currentSlideName();
      self.beforeSlideChange(slideId, state, evData);

      return state;
  });

  this.addCallback("AfterSlideChange", function(state, evData){
      var slideId = state.currentSlideName();
      self.afterSlideChange(slideId, state, evData);

      return state;
  });

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
