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
//state.js
/**
 * The state of the system. Supports the Suited framework and keep track of the current slide and mode
 * and allos the state to be manipulated.
 *
 * @returns {Object}   Containing the functions necessary to check and manipulate the state
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
        console.warn("Navigation will not work. Navigablenodes is null or empty");
    }

    var self = this; //For the private methods
    var slidePrefix = "slide-";
    var nav = null;
    var currentMode = null; //set by ModePlugin when mode swaps

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

    self.setNavigableNodes = function (slides) {
      navigableNodes = slides;
    }

    self.getCurrentModeName = function() {
        return currentMode.name;
    }

    self.getCurrentMode = function() {
        return currentMode;
    }

    /**
     * Set the mode and the function to use during navigation when checking if a slide should
     * be visible or not
     * @param {String}                  modeName The name of the current mode
     * @param {(slideIndex) => boolean} fnShouldShowSlide Function returns true if slide should be visible
     */
    self.setMode = function(theMode, fnShouldShowSlide) {
        currentMode = theMode;
        nav = new Nav(fnShouldShowSlide, navigableNodes);
    }

    this.makeSlideName = function (num) {
        return slidePrefix + num;
    }

    this.getSlideNumFromName = function (name) {
        var num =  name.slice(slidePrefix.length);
        return num;
    }

    this.setSlideNumber = function (slideNum) {
        currentSlide = slideNum;
    }

    this.currentSlideName = function currentSlideName() {
        return this.makeSlideName(currentSlide);
    };

    /**
     * Pure Function: returns the next Slide name.
     * @returns new currentID name.
     **/
    this.next = function next() {
      return this.makeSlideName(nav.calcNextNum(currentSlide));
    };


    /**
     *  Pure Function: returns the Previous Slide name.
     * @returns new currentID name.
     **/
    this.previous = function previous() {
      return this.makeSlideName(nav.calcPrevNum(currentSlide));
    };

  } // end constructor

module.exports = State;
