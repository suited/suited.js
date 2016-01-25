'use strict';
//utils.js

/*
 * module utils:
 
 * Utilies needed by the suited framework
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



var konstants = require('./konstants.js');
var k = konstants;
/**
 * Return the list of CSS classes on the element as an array 
 * @param   {Element} element The element to inspect for classes
 * @returns {Array}    Of Strings. The class names applied to the element
 */
var classList = function (element) {
    if (!element) return [];

    var classes = element.getAttribute("class");
    if (!classes) return [];

    return classes.split(" "); //Array of Strings
}

var utils = {};

/**
 * Replace on class in the list of classes with another. Replace clazz1 with clazz2
 * 
 * if classes on the element are: ["c1","c2","c3"] and clazz1='c2' and clazz2='c4' then resulting array is: ["c1","c4","c3"]
 * 
 * @param   {Element} element The element whose classes to change
 * @param   {String} clazz1  Classname to find and replace with clazz2
 * @param   {String} clazz2  Classname to use in place of clazz1
 * @returns {void} Side effecting. Changes the supplied element in place
 */
utils.toggleClass = function (element, clazz1, clazz2) {
    if (!element) return;

    var oldclasses = Array.prototype.slice.call(classList(element));

    var newclasses = oldclasses.map(function (i) {
        return (i === clazz1) ? clazz2 : i;
    });

    element.setAttribute("class", newclasses.join(" "));
};


/**
 * Add the class to the list of classes if present and addit=false, remove it. If NOT present and addit=true, add it.
 * 
 * @param {Element} element   The element whose classes to modify
 * @param {String}  clazzname The name of the class to add or remove
 * @param {Boolean} addit     Indicates if class should exist. Will be added or removed where necessary 
 * @returns {void}  Side affecting. Changes the clases of the element in place
 */
utils.classed = function (element, clazzname, addit) {
    if (!element) return;
    var oldclasses = Array.prototype.slice.call(classList(element));

    var index = oldclasses.indexOf(clazzname);
    if (index >= 0 && !addit) {
        oldclasses.splice(index, 1);
    }
    if (index < 0 && addit) {
        oldclasses.push(clazzname);
    }

    element.setAttribute("class", oldclasses.join(" "));

};

/**
 * Query using the selector within the scope of the provided parent node.
 * 
 * @param   {String} selection Query selection string
 * @param   {Element} parent    The parent node to search within
 * @returns {NodeList} The list of nodes matching the query. Empty list of nothing is found
 */
utils.selects = function (selection, parent) {
    if (!parent) parent = document;
    return parent.querySelectorAll(selection);
};

//TODO check if attr Values is an array or a function(dia) and call it to set the values
/* attValues is an array of values or a function(index, origArray) that returns the value for each item in the array */
utils.tag = function (nodeList, attrName, attrValues) {
    for (var i = 0; i < nodeList.length; ++i) {
        var theValue = (!attrValues) ? '' : attrValues(i);
        nodeList[i].setAttribute(attrName, theValue);

    }
};

utils.wrapDiv = function (element, id, clazz) {
    var theHtml = element.innerHTML;
    var newHtml = '<div class="' + clazz + '" id="' + id + '" >' + theHtml + '</div>';
    element.innerHTML = newHtml;
}

/** walk the sections tag/wrap nodes in a div with attr slide-<num>, tag child data-slides with data-sub-slide. and populate the state.nav structure

NB state requires utils... so state is passed into this func as it is called to prevent a cyclic dependency in require

@return number of slides
**/
utils.number = function (nodeList, state) {
    var numSlides = nodeList.length - 1;

    //TODO FIXME ther is an error here I thing wrapping moves nodes so children slides are not wrapped...
    // ... perhaps wrap in reverse order?
    //        for (var i = 0; i < state.numSlides; ++i) {
    for (var i = (numSlides); i >= 0; i--) {
        var item = nodeList[i]; // Calling myNodeList.item(i) isn't necessary in JavaScript
        utils.wrapDiv(item, "slide-" + i, "slide");

        //populate nav structure
        utils.populateNav(item, i, state.nav);
        var childSlides = utils.selects("section[data-slide]", item);
        utils.tag(childSlides, "data-sub-slide");
    }
    return numSlides;
};

utils.typeSlide = function (slideEl) {
    var ret = "section"; //belt and braces
    if (slideEl.hasAttribute("data-figure")) {
        ret = k.slideTypes["data-figure"];
    } else if (slideEl.hasAttribute("data-slide")) {
        ret = k.slideTypes["data-slide"]; //expected default
    }
    return ret;
}

//looks at the slide and puts it in the right location in the nav structure 
utils.populateNav = function (slideEl, position, nav) {
    switch (utils.typeSlide(slideEl)) {
        case "figure":
            nav.figure[position] = "filled";
            nav.slide[position] = "filled";
            break;
        case "slide":
            nav.figure[position] = null;
            nav.slide[position] = "filled";
            break;
        default:
            nav.figure[position] = null;
            nav.slide[position] = null;
            break;
    }
}

utils.placeIn = function (container, child) {
    var width = child.clientWidth;
    var height = child.clientHeight;

    var wRatio = container.clientWidth / width;
    var hRatio = container.clientHeight / height;

    var ratio = Math.min(wRatio, hRatio);
    ratio = ratio * 0.95;

    container.innerHTML = ""
    container.appendChild(child);
    child.setAttribute("style", "float: left; transform: scale(" + ratio + "); transform-origin: 0 0;");
}


/** parse parameters from a search string where
searchStr = location.search

returns a param Map object leyed on param name and value is param value.
*/
utils.parseParams = function (searchStr) {

    if (!searchStr || searchStr.charAt(0) != "?") return {
        mode: "doc"
    };

    var paramList = searchStr.substring(1); //Remove the ?
    var params = paramList.split("&");

    var paramMap = {};
    for (var i = 0; i < params.length; i++) {
        var kv = params[i].split("=");
        paramMap[kv[0]] = kv[1];
    }

    return paramMap;
}

/**
  extract slide number from location.hash
  */
utils.parseSlideNum = function (hash) {
    if (!hash || hash.charAt(0) != "#") return 0;

    return hash.substring(hash.indexOf("-") + 1);

}



module.exports = utils;
