'use strict';
// konstants.js
/**
 * Internal variables and constants. Should not normally be overwritten as it may affect functionality.
 **/
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

var k = {
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
    modes: ["doc", "deck", "walkthrough"],
    defaultTnames: {
        "scroll": "scroll",
        "jump": "jump",
        "scrollzoom": "scrollzoom"
    }
}

k.defaultTransitions = {};
k.defaultTransitions.jump = {};
k.defaultTransitions.jump.left = function (elId) {
    var prevHash = window.location.hash;
    window.location.hash = elId; //side effect on state            
    //If previous did not change the location then we can assume we are at the beginning. Clear hash to scroll all the way to the top
    if (prevHash === window.location.hash) {
        window.location.hash = "";
    }
};
k.defaultTransitions.jump.right = function (elId) {
    window.location.hash = elId;
};
k.defaultTransitions.jump.up = k.defaultTransitions.jump.left;
k.defaultTransitions.jump.down = k.defaultTransitions.jump.right;

k.defaultTransitions.scroll = {};
k.defaultTransitions.scroll.left = function (elId) {
    var el = document.getElementById(elId);
    if (el.scrollIntoView) {
        //    if (false) {
        el.scrollIntoView({
            block: "end",
            behavior: "smooth"
        });
    } else {
        var rect = el.getBoundingClientRect();
        window.scrollTo(0, rect.top);
        //fix location bar

    }

};
k.defaultTransitions.scroll.right = k.defaultTransitions.scroll.left;
k.defaultTransitions.scroll.up = k.defaultTransitions.scroll.left;
k.defaultTransitions.scroll.down = k.defaultTransitions.scroll.left;


k.defaultTransitions.scrollzoom = k.defaultTransitions.jump; //TODO fixme when scrollzoom implemented



module.exports = k;
