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
    var config = {};
    var c = config;

    var my = function () {};
    var state = {};
    state.numSlides = 0;          
    state.highlightFunc = function() {};
    state.currentNum = 0; //the currently selected section
    state.mode = k.mode[0]; //or deck

    state.previousNum = function () {
        if (state.currentNum <= 0) {
            return state.currentNum;
        } else {
            return (state.currentNum - 1);
        }
    };

    state.isDeck = function () {
        return (state.mode === k.mode[1]);
    }
    state.isDoc = function () {
        return (state.mode === k.mode[0]);
    }
    state.isWalkthrough = function () {
        return (state.mode === k.mode[2]);
    }

    state.slideName = function () {
        return "slide-" + state.currentNum;
    };

    state.previousSlideName = state.slideName(); //initially

    state.next = function () {
        if (state.currentNum >= state.numSlides) {
            return state.slideName();
        }
        state.previousSlideName = state.slideName();
        state.currentNum++;

        return state.slideName();
    };

    state.previous = function () {
        if (state.currentNum <= 0) {
            return state.slideName();
        }
        state.previousSlideName = state.slideName();
        state.currentNum--;

        return state.slideName();
    };

    state.currentNode = function () {
        return document.getElementById(state.slideName());
    };

    state.previousNode = function () {
        return document.getElementById(state.previousSlideName);
    };

    state.setMode = function(mode) {
        state.mode = mode;

        //change the highlight function
        switch (state.mode) {
            case k.mode[0]:
                state.highlightFunc = my.displays.doc;
                break;

            case k.mode[1]:
                state.highlightFunc = my.displays.slideDeck;
                break;

            case k.mode[2]:
                state.highlightFunc = my.displays.walkthrough;
                break;
        }        
    };
    
    state.toggleMode = function () {
        var modes = [k.mode[0], k.mode[1], k.mode[2]];

        var modeNum = modes.indexOf(state.mode) + 1;
        if (modeNum >= modes.length) {modeNum = 0;}
        
        state.setMode(modes[modeNum]);
    };
    

    my.showSlide = function () {
        var isDeck = state.isDeck();
        var isWalk = state.isWalkthrough();

        var slideWall = document.getElementById("slideWall");
        my.classed(slideWall, "slide-backdrop", isDeck);

        var slideHolder = document.getElementById("slideHolder");
        my.classed(slideHolder, "slide-holder", isDeck);

        my.classed(state.previousNode(), "slide-highlight", false);
        my.classed(state.previousNode(), "muted", false);
        my.classed(state.currentNode(), "slide-highlight", isDeck || isWalk);
        my.classed(state.currentNode(), "muted", isDeck || isWalk);

        var modal = document.getElementById("modal");
        my.classed(modal, "slide-box", isDeck);
        my.classed(modal, "zoom", isDeck);
        my.classed(modal, "not-displayed", !isDeck);
        modal.innerHTML = state.currentNode().innerHTML;
    }

    my.displays = {
        slideDeck: my.showSlide,
        walkthrough: my.showSlide,
        doc: my.showSlide
    };
        
    my.classList = function (element) {
        if (!element) return [];
        var classes = element.getAttribute("class");
        if (!classes) return [];
        return classes.split(" "); //Array of Strings
    }

    my.toggleClass = function (element, clazz1, clazz2) {
        if (!element) return;
        
        var oldclasses = Array.prototype.slice.call(my.classList(element));

        var newclasses = oldclasses.map(function (i) {
            if (i === clazz1) return clazz2;
            if (i === clazz2) return clazz1;
            return i;
        });

        element.setAttribute("class", newclasses.join(" "));
    };

    my.classed = function (element, clazzname, addit) {
        if (!element) return;
        var oldclasses = Array.prototype.slice.call(my.classList(element));

        var index = oldclasses.indexOf(clazzname);
        if (index >= 0 && !addit) {
            oldclasses.splice(index, 1);
        }
        if (index < 0 && addit) {
            oldclasses.push(clazzname);
        }

        element.setAttribute("class", oldclasses.join(" "));

    };

    my.selects = function (selection, parent) {
        if (!parent) parent = document;
        return parent.querySelectorAll(selection);
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
            var childSlides = my.selects("section[data-slide]", item);
            my.tag(childSlides, "data-sub-slide");

        }
    };

    my.toggleMode = function () {
        state.toggleMode();
        
        //window.location =window.location.origin + window.location.pathname + "?mode=" + state.mode + "#" + state.slideName();
        window.history.pushState("",window.title, window.location.origin + window.location.pathname + "?mode=" + state.mode + "#" + state.slideName());
        console.log("slide=" + state.slideName() + " state.mode is " + state.mode);
        
        state.highlightFunc();
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
     */
    my.key = function () {
        /*
           keycodes are: left = 37, up = 38, right = 39, down = 40
         */
        
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
                    window.location.hash = state.previous(); //side effect on state
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
            };

        };
    };


    my.init = function () {
        my.number(my.selects("section[" + k.slideAttr + "]"));
        my.key();

        // add placeholder for Modal backdrop
        var b = document.body;
        var slideWall = document.createElement("div");
        slideWall.setAttribute("id", k.modalBackdrop);
        b.appendChild(slideWall);

        var slideHolder = document.createElement("div");
        slideHolder.setAttribute("id", k.slideHolder);

        //Add the modal backdrop element
        var modal = document.createElement("div");
        modal.setAttribute("id", k.modal);
        my.classed(modal, "not-displayed", true);
        slideHolder.appendChild(modal);
        b.appendChild(slideHolder);
        
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
