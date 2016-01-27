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

var modes = konstants.modes;
var k = konstants;
var State = function (desiredPos, desiredMode) {

    
        var self = this; //For the private methods
    
        //sanity
        /* Initialise states */
        var currentNum = (desiredPos) ? Number(desiredPos) : 0;
        if (isNaN(currentNum)) {
            currentNum = 0
        };

        var mode = (modes.indexOf(desiredMode) >= 0) ? desiredMode : modes[0]; //or deck

        this.mode = function () {
            return mode;
        }

        var slidePrefix = k.idPrefix;

        // nav structure has a value in each position where the mode is valid and a null otherwise. populated by utils.number()
        var nav = {
            modepos: {},
            calcNextNum: function (start) {
                start = Number(start);
                var numSlides = nav.modepos[mode].length; 
                
                if (start >= numSlides) {
                    return numSlides - 1;
                } else {
                    var tryme = start + 1;
                    if (!(nav.modepos[mode][tryme])) {
                        return nav.calcNextNum(tryme);
                    } else
                        return tryme;
                }
            },
            /** recurs becwards loolin for a valid value for mode.
            @param start = starting num, usually s.currentNum */
            calcPrevNum: function (start) {
                if (start <= 0) {
                    return 0;
                } else {
                    var tryme = start - 1;
                    if (!(nav.modepos[mode][tryme])) {
                        return nav.calcPrevNum(tryme);
                    } else
                        return tryme;
                }
            }
        };
        // initailise an array to hold positions for each mode
        for (var i = 0; i < modes.length; i++) {
            nav.modepos[modes[i]] = [];
        }


        //TODO FIXME bin these we need seperate functions for a pluging that gets attached to a mode
        this.isDeck = function isDeck() {
            return (mode === modes[1]);
        }

        this.isDoc = function isDoc() {
            return (mode === modes[0]);
        }

        this.isWalkthrough = function isWalkthrough() {
                return (mode === modes[2]);
        }
            //---------------

        function makeSlideName(num) {
            return slidePrefix + num;
        }
        
        this.currentSlideName = function currentSlideName() {
            return makeSlideName(currentNum);
        }

        // private
        function changeSlide(fnChange, fnBeforeStateChange, fnAfterStateChange) {
            if (fnBeforeStateChange) {
                fnBeforeStateChange(self.currentSlideName());
            }
            
            currentNum = fnChange(currentNum);
            
            if (fnAfterStateChange) {
                fnAfterStateChange(self.currentSlideName());
            }
            
            return self.currentSlideName();
        }

        // private
        function populateNav(slideEl, position) {
            //TODO create a rule object so we can walk trough all modes applying the rules, rather than hardcode all values.
            switch (utils.typeSlide(slideEl)) {
                case "figure":
                    nav.modepos.doc[position] = true;
                    nav.modepos.deck[position] = true;
                    nav.modepos.walkthrough[position] = true;
                    break;
                case "slide":
                    nav.modepos.doc[position] = false;
                    nav.modepos.deck[position] = true;
                    nav.modepos.walkthrough[position] = false;
                    break;
                default:
                    nav.modepos.doc[position] = false;
                    nav.modepos.deck[position] = false;
                    nav.modepos.walkthrough[position] = false;
                    break;
            }
        }

        this.populateNavs = function populateNavs(listNavigableNodes) {
            for (var i = 0; i < listNavigableNodes.length; i++) {
                populateNav(listNavigableNodes[i], i);
            }
        }

        /**
         * modifies state to change current. 
         * @returns new currentID name.
         **/
        this.next = function next() {
            return makeSlideName(nav.calcNextNum(currentNum));
        };

        /**
         * modifies state to change current. 
         * @returns new currentID name.
         **/
        this.previous = function previous() {
            return makeSlideName(nav.calcPrevNum(currentNum));
        };
    
        this.changeMode = function (newMode, fnBeforeModeChange, fnAfterModeChange) {
            var bMode = mode;
            
            if (k.modes.indexOf(newMode) < 0) {
                newMode = k.modes[0];
            }
            
            if (fnBeforeModeChange) {
                fnBeforeModeChange(bMode, newMode);
            }
            
            // NB this is the real state change
            mode = newMode;
            console.debug("slide=" + this.currentSlideName() + " state.mode is " + mode);

            if (fnAfterModeChange) {
                fnAfterModeChange(bMode, mode);
            }
            
            return mode;
        }

        //TODO refactor to listen for mode chage event
        /**
          switches mode, and applied lifcycle function before and after.
          @param fnBeforeModeChange(previousMode, nextMode)
          @param fnAfterModeChange(previousMode, nextMode)
        **/
        this.toggleMode = function toggleMode(fnBeforeModeChange, fnAfterModeChange) {

            var modeNum = modes.indexOf(mode) + 1;
            if (modeNum >= modes.length) {
                modeNum = 0;
            }
         
            return this.changeMode(modes[modeNum], fnBeforeModeChange, fnAfterModeChange);
        };
    
        this.changeState = function (newSlideNumber, newMode, fnBeforeSlideChange, fnAfterSlideChange, fnBeforeModeChange, fnAfterModeChange) {
            
            if (currentNum != newSlideNumber) {
                
                changeSlide(function() {return newSlideNumber;}, fnBeforeSlideChange, fnAfterSlideChange);
            }
            
            if (mode != newMode) {
                this.changeMode(newMode, fnBeforeModeChange, fnAfterModeChange);
            }
            
        };

    } // end constructor


module.exports = State;
