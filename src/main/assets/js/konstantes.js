/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   robertk
* @Last modified time: 2016-Aug-12
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
// konstants.js
/**
 * Internal variables and constants. Should not normally be overwritten as it may affect functionality.
 **/

function linearnterpolateNumber(a, b) {
    return function (t) {
        return a + t * (b - a);
    };
}

function tween(startnum, endnum, durationMs, doFn, interpolator, delay) {

    //close over these
    var ease = interpolator(startnum, endnum);
    var startTime = (new Date()).getTime();
    var duration = durationMs;

    var endTime = startTime + durationMs;
    var t = 0;
    delay = (!!delay) ? delay : 0; //ms

    //    console.debug("startTime=" + startTime + "  endTime = " + endTime);
    //doFn(ease(0));


    //@recursive
    function _tween() {

        setTimeout(function () {
            var now = (new Date()).getTime(); // in millisecs

            // bail out
            if (now >= endTime) {
                doFn(endnum);
                return;
            }

            //otherwise
            var new_t = (now - startTime) / duration;
            var newval = ease(new_t);
            //            console.debug("new_t=" + new_t + "  newval = " + newval);
            doFn(newval);
            _tween();
        }, (delay > 0 ? delay : 0));
    };

    //kick off
    _tween(doFn, ease);
}


//    var rateX = (x - (document.documentElement.scrollLeft || document.body.scrollLeft)) * m;
//    var rateX = (x - window.scrollX) * m;
//    var rateY = (y - (document.documentElement.scrollTop || document.body.scrollTop)) * m;



var k = {
    "version": "0.0.1",
    idPrefix: "slide-",
    slideAttr: "data-slide",
    slideTypes: {
        "data-figure": "figure", //vis in doc and deck
        "data-slide": "slide" //viz in deck only
            //default section is in doc only
    },
    slideAttrs: {
        figure: "data-figure", //vis in doc and deck
        slide: "data-slide" //viz in deck only
            //default section is in doc only
    },
    modalBackdrop: "slideWall",
    slideHolder: "slideHolder",
    modal: "modal",
    defaultTnames: {
        "scroll": "scroll",
        "jump": "jump",
    },
    STYLE_FOR_MODE_ID: "mode-style", //e element added to head by ModePlugin
    ZOOM_DURATION: 800,
    SCROLL_DURATION: 400,
    SCROLL_DELAY_DURATION: 15
};

k.defaultTransitions = {};
k.defaultTransitions.jump = {name:"jump"};

k.defaultTransitions.jump.top = function (elId) {
    window.location.hash = "#";
}
k.defaultTransitions.jump.default = function (elId) {
    window.location.hash = elId; //side effect on state
};

k.defaultTransitions.jump.left = k.defaultTransitions.jump.default;
k.defaultTransitions.jump.right = k.defaultTransitions.jump.default;
k.defaultTransitions.jump.up = k.defaultTransitions.jump.left;
k.defaultTransitions.jump.down = k.defaultTransitions.jump.right;

k.defaultTransitions.scroll = {name:"scroll"};



k.defaultTransitions.scroll.top = function (elId) {
    var el = document.getElementById(elId);
    var startPos = window.scrollY;
    var yPos = -window.scrollY;

    //calc relative tweens and scrollTo so start at 0 go to start + ypos
    tween(0, yPos, k.SCROLL_DURATION, function (y) {
        window.scrollTo(0, startPos + y);
    }, linearnterpolateNumber, k.SCROLL_DELAY_DURATION)
};



k.defaultTransitions.scroll.left = function (elId) {
    var el = document.getElementById(elId);
    var yPos = 0;
    var startPos = window.scrollY;

    var rect = el.getBoundingClientRect();
    yPos = rect.top;



    //calc relative tweens and scrollTo so start at 0 go to start + ypos
    tween(0, yPos, k.SCROLL_DURATION, function (y) {
        window.scrollTo(0, startPos + y);
    }, linearnterpolateNumber, k.SCROLL_DELAY_DURATION)



};

k.defaultTransitions.scroll.right = k.defaultTransitions.scroll.left;
k.defaultTransitions.scroll.up = k.defaultTransitions.scroll.left;
k.defaultTransitions.scroll.down = k.defaultTransitions.scroll.left;



//k.test = tween;
//k.ease = linearnterpolateNumber;



module.exports = k;
