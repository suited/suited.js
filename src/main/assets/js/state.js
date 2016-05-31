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

var konstants = require('./konstantes.js');
var utils = require('./utils.js');

var k = konstants;

var Nav = require("./nav.js");

/**
 * Manages the slide state. Keep track of which is the current slide and which are valid slides.
 * 
 * The list of valid slides are populated by the mode 
 * @param   {[[Type]]} suited     [[Description]]
 * @param   {[[Type]]} desiredPos [[Description]]
 * @returns {boolean}  [[Description]]
 */
var State = function (desiredPos, navigableNodes) {

    //Sanity check, fix input to defaults if invalid
    
    if (!desiredPos) {
        desiredPos = 0;
    }
    
    if (!navigableNodes || navigableNodes.length == 0) {
        console.error("Navigation will not work. Navigablenodes is null or empty");
    }

    var self = this; //For the private methods
    var slidePrefix = "slide-";
    var nav = null;    
    var currentModeName = null;
    var currentSlide = desiredPos;
    
    var shoudShowSlide = function(slideIndex) {
        console.warn("Using default show slide function, which shows everything");
        
        if (slideIndex >= navigableNodes.length) {
            return undefined;
        }
        else {       
            return slideIndex >= 0;
        }
    };    
    
    self.getCurrentModeName = function() {
        return currentModeName;
    }
    
    /**
     * Set the mode and the function to use during navigation when checking if a slide should
     * be visible or not
     * @param {String}                  modeName The name of the current mode
     * @param {(slideIndex) => boolean} fnShouldShowSlide Function returns true if slide should be visible
     */
    self.setMode = function(modeName, fnShouldShowSlide) {
        currentModeName = modeName;
        nav = new Nav(fnShouldShowSlide, navigableNodes);
    }
    
    function makeSlideName(num) {
        return slidePrefix + num;
    }    
    
    this.setSlideNumber = function (slideNum) {
        currentSlide = slideNum;
    } 
    
    this.currentSlideName = function currentSlideName() {
        return makeSlideName(currentSlide);
    };
    
    /**
     * modifies state to change current. 
     * @returns new currentID name.
     **/
    this.next = function next() {        
      return makeSlideName(nav.calcNextNum(currentSlide));
    };    
        
    /**
     * modifies state to change current. 
     * @returns new currentID name.
     **/
    this.previous = function previous() {
      return makeSlideName(nav.calcPrevNum(currentSlide));
    };
    
  } // end constructor

module.exports = State;
