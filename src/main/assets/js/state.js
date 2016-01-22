'use strict';
/**
 * The state of the system. Supports the Suited framework and keep track of the current slide and mode
 * and allos the state to be manipulated.
 * 
 * @param   {Array} modesArr Array of strings describing the available modes
 * @returns {Object}   Containing the functions necessary to check and manipulate the state
 */
var mod = function SuitedState(modesArr) {



    var modes = modesArr;
    var s = {};

    s.numSlides = 0;
    s.currentNum = 0; //the currently selected section
    s.mode = modes[0]; //or deck

    s.previousNum = function () {
        if (s.currentNum <= 0) {
            return s.currentNum;
        } else {
            return (s.currentNum - 1);
        }
    };

    s.isDeck = function () {
        return (s.mode === modes[1]);
    }
    s.isDoc = function () {
        return (s.mode === modes[0]);
    }
    s.isWalkthrough = function () {
        return (s.mode === modes[2]);
    }

    s.slideName = function () {
        return "slide-" + s.currentNum;
    };

    s.previousSlideName = s.slideName(); //initially

    s.next = function () {
        if (s.currentNum >= s.numSlides) {
            return s.slideName();
        }
        s.previousSlideName = s.slideName();
        s.currentNum++;

        return s.slideName();
    };

    s.previous = function () {
        if (s.currentNum <= 0) {
            return s.slideName();
        }
        s.previousSlideName = s.slideName();
        s.currentNum--;

        return s.slideName();
    };

    s.currentNode = function () {
        return document.getElementById(s.slideName());
    };

    s.previousNode = function () {
        return document.getElementById(s.previousSlideName);
    };

    s.setMode = function (mode) {
        s.mode = mode;
    };

    s.toggleMode = function () {

        var modeNum = modes.indexOf(s.mode) + 1;
        if (modeNum >= modes.length) {
            modeNum = 0;
        }

        s.setMode(modes[modeNum]);
    };

    return s;
}

module.exports = mod;
