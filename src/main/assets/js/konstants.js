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

var konstants = {
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
    modes: ["doc", "deck", "walkthrough"]
}

module.exports = konstants;
