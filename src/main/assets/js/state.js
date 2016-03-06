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

var State = function (desiredPos, modeObjectsArr, desiredMode) {

    //Sanity check, fix input to defaults if invalid
    
    if (!desiredPos) {
        desiredPos = 0;
    }
    
    if (!desiredMode) {
        desiredMode = modeObjectsArr[0];
    }
    

    var self = this; //For the private methods

    //sanity
    /* Initialise states */
    var currentNum =  0;    
    var modeNames = [];
    var modes = {};
    this.currentMode = null;
    
    this.mode = function () {
      return modes[this.currentMode];
    }

    this.changeMode = function (newMode) {
     
      if (!newMode) {
          newMode = modeNames[0];
      }    
        
      if (modeNames.indexOf(newMode) < 0) {
        newMode = modeNames[0];
      }
        
      //Clean up on current mode
      if (this.mode()) {
        this.mode().cleanUp();
      }
        
      var modeObj = modes[newMode];
      modeObj.beforeModeChange();

      // NB this is the real state change
      this.currentMode = newMode;

      modeObj.afterModeChange();

      return newMode;
    }

    var slidePrefix = k.idPrefix;


    //todo build string from an array in config.
    var selectString = "section[" + k.slideAttrs['figure'] + "], section[" + k.slideAttrs['slide'] + "]";
    var navigableNodes = utils.selects(selectString);


    //TODO FIXME need a better plugggble magic func in each mode
    function magicModePosTest(pos, mode) {

      if (pos < 0) return true;

      // TODO should return undifined immediatly if pos is too big?
      if (pos >= navigableNodes.length) return undefined; // this is bad perf becaus we double count up then back down.
      var el = navigableNodes.item(pos);
      switch (utils.typeSlide(el)) {
        case "figure":
          return true
          break;
        case "slide":
          return (mode === "deck");

          break;
        default:
          return false;
          break;
      }
    }

    var nav = new Nav(magicModePosTest);

    //---------------

    function makeSlideName(num) {
      //if (Number(num) < 0) return slidePrefix + "top";
      return slidePrefix + num;
    }

    this.currentSlideName = function currentSlideName() {
      return makeSlideName(currentNum);
    }

    // private
    function changeSlide(fnChange) {
      var modeObj = self.mode();    
      modeObj.beforeSlideChange(self.currentSlideName());

      currentNum = fnChange(currentNum);

      modeObj.afterSlideChange(self.currentSlideName());

      return self.currentSlideName();
    }

    /**
     * modifies state to change current. 
     * @returns new currentID name.
     **/
    this.next = function next() {
      return makeSlideName(nav.calcNextNum(currentNum, this.currentMode));
    };

    /**
     * modifies state to change current. 
     * @returns new currentID name.
     **/
    this.previous = function previous() {
      return makeSlideName(nav.calcPrevNum(currentNum, this.currentMode));
    };



    //TODO refactor to listen for mode chage event
    /**
      switches mode, and applied lifcycle function before and after.
    **/
    this.toggleMode = function toggleMode() {

      var modeNum = modeNames.indexOf(this.currentMode) + 1;
      if (modeNum >= modeNames.length) {
        modeNum = 0;
      }

      return this.changeMode(modeNames[modeNum]);
    };

    this.changeState = function (newSlideNumber, newMode) {

      if (newMode && this.currentMode != newMode) {
        this.changeMode(newMode);
      }
       
      //Do slide change after mode change to draw slides properly
      if (currentNum != newSlideNumber) {

        changeSlide(function () {
          return newSlideNumber;
        });
      }        

    };

    
    //Change the array into a name based map
    for (var i=0; i < modeObjectsArr.length; i++) {
        var modeName = modeObjectsArr[i].name;
        modeNames.push(modeName);
        modes[modeName] = modeObjectsArr[i];
    }
    
    //Now that all is defined set the state and fire appropriate mode and slide change handlers
    this.changeState(desiredPos, desiredMode);
  } // end constructor


module.exports = State;
