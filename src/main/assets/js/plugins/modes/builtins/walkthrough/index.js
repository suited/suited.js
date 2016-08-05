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



import utils from '../../../../utils';
import modeutils from '../../utils';
import Mode from '../../mode';

let name = "walkthrough";

function beforeSlide(slideId, state, evData) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", false);
    utils.classed(currentNode, "muted", false);
}

function afterSlide(slideId, state, evData) {
    var currentNode = document.getElementById(slideId);
    utils.classed(currentNode, "slide-highlight", true);
    utils.classed(currentNode, "muted", true);
}

function walkMode(enable) {
    //hide or reveal all slides as required
    var slides = utils.selects("section[data-slide]");
    for (var i = 0; i < slides.length; ++i) {
        utils.classed(slides[i], "not-displayed", enable);
    }
}

function beforeModeChange(state, evData) {
    walkMode(true);
}

function cleanUp(state) {
    beforeSlide(state.currentSlideName());
    walkMode(false);
}

export default new Mode(name, beforeSlide, afterSlide, beforeModeChange, null, cleanUp, modeutils.getShouldShowSlideFunction(name))
