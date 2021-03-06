/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   dirk
* @Last modified time: 2016-08-15T20:45:36+10:00
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
//utils.js

/*
 * module utils:

 * Utilies needed by the suited framework
 */
var konstants = require('./konstantes.js');
var k = konstants;

var konfig = require('./konfig.js');
var c = konfig;
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
 * Add the style to the element. if no stylePropertyValue is supplied remove that style from an element.
 *
 * @param {Element} element   The element whose style to modify
 * @param {String}  stylePropertyName The name of the style to add or remove
 * @param {Boolean} addit     Indicates if class should exist. Will be added or removed where necessary
 * @returns {void}  Side affecting. Changes the clases of the element in place
 */
utils.styled = function (element, stylePropertyName, stylePropertyValue) {
    var stylePropertyValid = function(name,value){
                    //if valurundefined we should remove the property
                    //checking that the value is not a object
               return  typeof value !== 'object' &&
                    //checking that the value is not a function
                    typeof value !== 'function' &&
                    //checking that we dosent have empty string
                    value.length > 0 &&
                    //checking that the property is not int index ( happens on some browser
                    value != parseInt(value)

    };
     if(!!stylePropertyValue && !stylePropertyValid(stylePropertyName, stylePropertyValue)) {
       console.error("styled(): Bad style: propname:"+ stylePropertyName + " value'" + stylePropertyValue + "'")
       return;
     }

     if(!!stylePropertyValue) {
        //set the style
        element.style[stylePropertyName] = stylePropertyValue;
     } else {
       // remove the style
       console.log("deleteing style "+stylePropertyName+ " for element "+element)
       element.style.removeProperty(stylePropertyName);
     }

  }

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

  var innerHtml = element.innerHTML;
  element.innerHTML = "";

  var wrapper = document.createElement("div");
  utils.classed(wrapper, clazz, true);
  wrapper.setAttribute("id", id);
  element.appendChild(wrapper);

  wrapper.innerHTML = innerHtml;
}

/** walk the sections tag/wrap nodes in a div with attr slide-<num>, tag child data-slides with data-sub-slide. and populate the state.nav structure

NB state requires utils... so state is passed into this func as it is called to prevent a cyclic dependency in require

@return number of slides
**/
utils.number = function (nodeList) {
  var numSlides = nodeList.length - 1;

  for (var i = (numSlides); i >= 0; i--) {
    var item = nodeList[i]; // Calling myNodeList.item(i) isn't necessary in JavaScript
    utils.wrapDiv(item, "slide-" + (i), "slide");
    var childSlides = utils.selects("section[data-slide]", item);
    utils.tag(childSlides, "data-sub-slide");
  }
  return;
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

/**
 * Scroll window to an elements y location
 **/
utils.scrollToY = function (element) {
  if (element.scrollIntoView) {
    element.scrollIntoView();
  } else {
    var rect = element.getBoundingClientRect();
    window.scrollTo(0, rect.top);
  }
}


/**
 * Return the array of unique values fron the xs array
 *
 **/
utils.unique = function (xs) {
  return xs.filter(function (x, i) {
    return xs.indexOf(x) === i
  });
}

/**
 * if (storageAvailable('localStorage'))
 **/
utils.storageAvailable = function (type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

utils.localstore = function(item,value) {
   var PREFIX="suited-";
   if (!!utils.storageOK || utils.storageAvailable('localStorage')) {
     utils.storageOK = true;
     var storage = window['localStorage']
     if(!item) { return; }
     if(!value) {
       //getter
       return storage.getItem(item);
     } else {
       //setter
       storage.setItem(item,value);
     }
   }
   else {
     utils.storageOK = false;
     console.log("Oops cant do localstorage so no speaker notes");
   }
}

module.exports = utils;
