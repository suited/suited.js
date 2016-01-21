/* Core features and management - eg finds and tags all slide elements */
function core() {
    var constants = {}
    var config = {};
    var my = function () {};
    var state = {};

    my.displays = {
        slideDeck: function () {
            var slideWall = document.getElementById("slideWall");
            my.classed(slideWall, "slide-backdrop", true);

            var slideHolder = document.getElementById("slideHolder");
            my.classed(slideHolder, "slide-holder", true);



            my.classed(state.previousNode(), "slide-highlight", false);
            my.classed(state.previousNode(), "muted", false);
            my.classed(state.currentNode(), "slide-highlight", true);
            my.classed(state.currentNode(), "muted", true);

            var modal = document.getElementById("modal");
            my.classed(modal, "slide-box", true);
            my.classed(modal, "zoom", true);
            my.classed(modal, "not-displayed", false);
            modal.innerHTML = state.currentNode().innerHTML;
        },
        walkthrough: function () {
            var slideWall = document.getElementById("slideWall");
            my.classed(slideWall, "slide-backdrop", false);

            var slideHolder = document.getElementById("slideHolder");
            my.classed(slideHolder, "slide-holder", false);

            var modal = document.getElementById("modal");
            my.classed(modal, "slide-box", false);
            my.classed(modal, "not-displayed", true);

            my.classed(state.previousNode(), "slide-highlight", false);
            my.classed(state.previousNode(), "muted", false);
            my.classed(state.currentNode(), "slide-highlight", true);
            my.classed(state.currentNode(), "muted", false);
        },
        doc: function () {
            var slideWall = document.getElementById("slideWall");
            my.classed(slideWall, "slide-backdrop", false);

            var slideHolder = document.getElementById("slideHolder");
            my.classed(slideHolder, "slide-holder", false);

            var modal = document.getElementById("modal");
            my.classed(modal, "slide-box", false);
            my.classed(modal, "not-displayed", true);

            my.classed(state.previousNode(), "slide-highlight", false);
            my.classed(state.currentNode(), "slide-highlight", false);
        }
    };


    //the currently selected section
    state.currentNum = 0;
    state.mode = "doc"; //or deck
    state.numSlides = 0;
    state.previousNum = function () {
        if (state.currentNum <= 0) {
            return state.currentNum;
        } else {
            return (state.currentNum - 1);
        }
    };

    state.highlightFunc = my.displays.doc;

    state.isDeck = function () {
        return (state.mode === "deck");
    }
    state.isDoc = function () {
        return (state.mode === "doc");
    }
    state.isWalkthrough = function () {
        return (state.mode === "walkthrough");
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

    state.modeNum = 0;
    state.toggleMode = function () {
        var modes = ["doc", "deck", "walkthrough"];
        //cycle through the possible modes
        if (state.modeNum === (modes.length - 1)) {
            state.modeNum = 0;
        } else {
            state.modeNum++;
        }
        state.mode = modes[state.modeNum];

        //change the highlight function
        switch (state.mode) {
            case "doc":
                state.highlightFunc = my.displays.doc;
                break;

            case "deck":
                state.highlightFunc = my.displays.slideDeck;
                break;

            case "walkthrough":
                state.highlightFunc = my.displays.walkthrough;
                break;
        }
    }

    var toplevel = [];




    my.classList = function (element) {
        if (!element) return [];
        var classes = element.getAttribute("class");
        if (!classes) return [];
        return classes.split(" "); //Array of Strings
    }

    my.toggleClass = function (element, clazz1, clazz2) {
        if (!element) return;
        var newclasses = [];
        var oldclasses = Array.prototype.slice.call(my.classList(element));
        for (var i = 0; i < olclasses.lenght; i++) {
            if (oldclasses[i] == clazz1) {
                newclasses[i] = clazz2;
            } else if (oldclasses[i] == clazz2) {
                newclasses[i] = clazz1;
            } else {
                newclasses[i] = oldclasses[i];
            }
        }
        element.setAttribute("class", newclasses.join(" "));
    };

    my.classed = function (element, clazzname, addit) {
        if (!element) return;
        var oldclasses = Array.prototype.slice.call(my.classList(element));
        var add = false; // which means remove
        //        if(typeof predicate === "function") {
        //            add = predicate();
        //        }
        //        else {
        //        }

        var index = oldclasses.indexOf(clazzname);
        if (index >= 0) {
            if (!addit) {
                oldclasses.splice(index, 1);
            }

        } else {
            if (addit) {
                oldclasses.push(clazzname)
            }
        };

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
        //        my.tag(nodeList, "data-section-num", function (i) {
        //            return i;
        //        });
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
        //        var slideWall = document.getElementById("slideWall");
        //        my.classed(slideWall, "slide-backdrop", state.isDeck());
        //
        //        var slideHolder = document.getElementById("slideHolder");
        //        my.classed(slideHolder, "slide-holder", state.isDeck());
    }




    my.key = function () {
        /*
           keycodes are:

           left = 37
           up = 38
            right = 39
           down = 40
         */
        document.onkeyup = function (evt) {
            var kc = evt.keyCode;
            switch (kc) {
                case 37:
                    console.log("Previous " + evt.keyCode);
                    window.location.hash = state.previous(); //side effect on state
                    console.log("slide=" + state.slideName() + " state.mode is " + state.mode + "  state.modeNum=" + state.modeNum);
                    console.log("state.highlight= " + state.highlightFunc);
                    if (state.modeNum) {
                        state.highlightFunc();
                    }
                    break;
                case 39:
                    console.log("Next " + evt.keyCode);
                    window.location.hash = state.next(); // side effect on state
                    console.log("slide=" + state.slideName() + " state.mode is " + state.mode + "  state.modeNum=" + state.modeNum);
                    console.log("state.highlight= " + state.highlightFunc);
                    if (state.modeNum) {
                        state.highlightFunc();
                    }
                    break;
                case 83:
                    if (evt.shiftKey) {
                        console.log("toggle mode: " + state.mode);

                        my.toggleMode(); //side effect on state.mode


                        console.log("slide=" + state.slideName() + " state.mode is " + state.mode + "  state.modeNum=" + state.modeNum);
                        console.log("state.highlight= " + state.highlightFunc);


                        state.highlightFunc();


                    }
            };

        };
    };



    my.init = function () {
        my.number(my.selects("section[data-slide]"));
        my.key();

        // add placeholder for Modal backdrop
        var b = document.body;
        var slideWall = document.createElement("div");
        slideWall.setAttribute("id", "slideWall"); //TODO name is a magic sprinkle
        b.appendChild(slideWall);

        var slideHolder = document.createElement("div");
        slideHolder.setAttribute("id", "slideHolder"); //TODO name is a magic sprinkle

        var modal = document.createElement("div");
        modal.setAttribute("id", "modal"); //TODO name is a magic sprinkle
        my.classed(modal, "not-displayed", true);

        slideHolder.appendChild(modal)


        b.appendChild(slideHolder);

    }

    return my;
}; //closure
