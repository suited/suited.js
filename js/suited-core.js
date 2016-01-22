/*
* Utilies needed by the suited framework
*/
function SuitedUtils() {

    var su = {};
    
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
    su.toggleClass = function (element, clazz1, clazz2) {
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
    su.classed = function (element, clazzname, addit) {
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
    su.selects = function (selection, parent) {
        if (!parent) parent = document;
        return parent.querySelectorAll(selection);
    };
    
    su.placeIn = function (container, child) {
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
    
    return su;
}

/**
 * The state of the system. Supports the Suited framework and keep track of the current slide and mode
 * and allos the state to be manipulated.
 * 
 * @param   {Array} modesArr Array of strings describing the available modes
 * @returns {Object}   Containing the functions necessary to check and manipulate the state
 */
function SuitedState (modesArr) {
    
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

    s.setMode = function(mode) {
        s.mode = mode;
    };
    
    s.toggleMode = function () {
        
        var modeNum = modes.indexOf(s.mode) + 1;
        if (modeNum >= modes.length) {modeNum = 0;}
        
        s.setMode(modes[modeNum]);
    };    
    
    return s;
}


/* Core features and management - eg finds and tags all slide elements */
function core() {
    
    var konstants = {
        slideAttr: "data-slide",
        modalBackdrop: "slideWall",
        slideHolder: "slideHolder",
        modal: "modal",
        mode: ["doc","deck","walkthrough"]
    }
    var k = konstants;
    var config = {
        modalBackdropOpacity: 0.5
    };
    
    var c = config;
    
    var utils = new SuitedUtils();
    var state = new SuitedState(k.mode);
    

    var my = function () {};
    
    my.maxModalWidth = 0;
    my.maxModalHeight = 0;
    
    my.showSlide = function () {
        var isDeck = state.isDeck();
        var isWalk = state.isWalkthrough();

        var slideWall = document.getElementById("slideWall");
        utils.classed(slideWall, "slide-backdrop", isDeck);
        slideWall.setAttribute("style","opacity: " + c.modalBackdropOpacity);        
        
        var slideHolder = document.getElementById("slideHolder");
        utils.classed(slideHolder, "slide-holder", isDeck);

        utils.classed(state.previousNode(), "slide-highlight", false);
        utils.classed(state.previousNode(), "muted", false);
        
        var currentNode = state.currentNode();
        utils.classed(currentNode, "slide-highlight", isDeck || isWalk);
        utils.classed(currentNode, "muted", isDeck || isWalk);

        var modal = document.getElementById("modal");
        utils.classed(modal, "slide-box", isDeck);
        utils.classed(modal, "not-displayed", !isDeck);
        //modal.innerHTML = state.currentNode().innerHTML;
        
        var temp = document.createElement("div");
        temp.setAttribute("style", "display: inline-block; visible: false;");
        
        document.body.appendChild(temp);
        temp.innerHTML = currentNode.innerHTML;
        
        console.log("Temp size is: " + temp.clientWidth);
        
        utils.placeIn(modal, temp);
    }
    
    my.highlightFunc = my.showSlide; //Idea is to have dynamic highlight functions when changing the mode;

    my.displays = {
        slideDeck: my.showSlide,
        walkthrough: my.showSlide,
        doc: my.showSlide
    };
        


    //TODO check if attr Values is an array or a function(dia) and call it to set the values
    /* attValues is an array of values or a function(index, origArray) that returns the value for each item in the array */
    my.tag = function (nodeList, attrName, attrValues) {
        for (var i = 0; i < nodeList.length; ++i) {
            var theValue = (!attrValues) ? '' : attrValues(i);
            nodeList[i].setAttribute(attrName, theValue);

        }
    };

    my.wrapDiv = function (element, id, clazz) {
        var theHtml = element.innerHTML;
        var newHtml = '<div class="' + clazz + '" id="' + id + '" >' + theHtml + '</div>';
        element.innerHTML = newHtml;
    }

    my.number = function (nodeList) {
        state.numSlides = nodeList.length - 1;

        //TODO FIXME ther is an error here I thing wrapping moves nodes so children slides are not wrapped...
        // ... perhaps wrap in reverse order?
        //        for (var i = 0; i < state.numSlides; ++i) {
        for (var i = (state.numSlides); i >= 0; i--) {
            var item = nodeList[i]; // Calling myNodeList.item(i) isn't necessary in JavaScript
            my.wrapDiv(item, "slide-" + i, "slide");
            var childSlides = utils.selects("section[data-slide]", item);
            my.tag(childSlides, "data-sub-slide");
        }
    };
    
    my.changeHighlightFunc = function (mode) {
        
        my.highlightFunc = my.showSlide; // The highlightFunc can be updated here based on mode. For now all the same function
    }
    
    my.toggleMode = function () {
        state.toggleMode();
        my.changeHighlightFunc(state.mode);
        
        window.history.pushState("",window.title, window.location.origin + window.location.pathname + "?mode=" + state.mode + "#" + state.slideName());
        console.log("slide=" + state.slideName() + " state.mode is " + state.mode);
        
        my.highlightFunc();
    }

    my.parseParams = function (searchStr) {
        
        if (!searchStr || searchStr.charAt(0) != "?") return { mode: "doc"};
        
        var paramList = searchStr.substring(1); //Remove the ?
        var params = paramList.split("&");
        
        var paramMap = {};
        for (var i=0; i < params.length; i++) {
            var kv = params[i].split("=");
            paramMap[kv[0]] = kv[1];
        }
        
        return paramMap;
    } 

    my.parseSlideNum = function(hash) {
        if (!hash || hash.charAt(0) != "#") return 0;
        
        return hash.substring(hash.indexOf("-") + 1);
        
    }
    
    my.hashChanged = function(location) {
         console.log("Location changed!" + location); 

        var paramMap = my.parseParams(location.search);
        
        state.setMode(paramMap.mode);
        
        var slideNum = my.parseSlideNum(location.hash);
        if (state.currentNum != slideNum) {
            state.previousSlideName = state.slideName();
            state.currentNum = slideNum;        
        }
        
        state.highlightFunc();  
    };
    
    
    /**
     * Handle the shortcuts and arrow navigation
     * 
     * keycodes are: left = 37, up = 38, right = 39, down = 40
     */
    my.key = function () {
        
        document.onkeyup = function (evt) {
            var kc = evt.keyCode;
            switch (kc) {
                case 27: //escape
                    state.mode = k.mode[k.mode.length -1]; // dirty little hack..... because it assumes toggle will wrap around and that doc is the first in the list.
                    my.toggleMode();
                    console.log("Mode reset to doc");
                    
                    break;
                case 37: // Left arrow
                    console.log("Previous " + evt.keyCode);
                    
                    var current = state.currentNum;
                    var nextSlide = state.previous();
                    if (current == state.currentNum) {
                        nextSlide = "";
                    }
                    
                    window.location.hash = nextSlide; //side effect on state            
                    console.log("slide=" + state.slideName() + " state.mode is " + state.mode);

                    break;
                case 39: // Right arrow
                    console.log("Next " + evt.keyCode);
                    window.location.hash = state.next(); // side effect on state
                    console.log("slide=" + state.slideName() + " state.mode is " + state.mode);

                    break;
                case 83: //s
                    if (evt.shiftKey) {
                        my.toggleMode(); //side effect on state.mode
                        console.log("current mode: " + state.mode);                        
                    }
                    break;
                case 84: //t
                    if (evt.shiftKey) {
                        window.location.hash = "";
                        my.setMode(k.mode[0]);
                        console.log("current mode: " + state.mode);                        
                    }
                    break;                    
            };

        };
    };

    
    my.init = function () {
        my.number(utils.selects("section[" + k.slideAttr + "]"));
        my.key();

        // add placeholder for Modal backdrop
        var b = document.body;
        
        var slideWall = document.createElement("div");
        slideWall.setAttribute("id", k.modalBackdrop);
        b.appendChild(slideWall);

        var slideHolder = document.createElement("div");
        slideHolder.setAttribute("id", k.slideHolder);
        b.appendChild(slideHolder);

        //Add the modal backdrop element
        slideHolder.innerHTML = '<div style="float: left; width: 20%;">&nbsp;</div><div id="' + k.modal + '" style="float: left; width:60%">&nbsp;</div><div style="float: left; width: 20%;">&nbsp;</div>';
                
        //Default display function is doc.        
        state.highlightFunc = my.displays.doc;
        
        //Put everything in the right state
        my.hashChanged(window.location);
        
        window.addEventListener("hashchange", function (e) {
            my.hashChanged(window.location);
        });
    };

    return my;
}; //closure
