/* Core features and management - eg finds and tags all slide elements */
function core() {

    var state = {};

    //the currently selected section
    state.current = 0;
    state.mode = "doc"; //or deck
    state.numSlides = 0;
    state.isDeck = function () {
        return (state.mode === "deck");
    }

    state.slideName = function () {
        return "slide-" + state.current;
    };

    state.next = function () {
        if (state.current >= state.numSlides) {
            return state.slideName();
        }

        state.current++;

        return state.slideName();
    };

    state.previous = function () {
        if (state.current <= 0) {
            return state.slideName();
        }

        state.current--;

        return state.slideName();
    };

    state.toggleMode = function () {
        state.mode = (state.mode == "doc") ? "deck" : "doc";
    }

    var toplevel = [];



    var my = function () {};

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
        //        var parent = element.parentNode;
        //        var wrapper = document.createElement("div");
        //        wrapper.setAttribute("class", clazz);
        //        wrapper.setAttribute("id", id);
        //        wrapper.appendChild(element);
        //        parent.appendChild(wrapper);
        var theHtml = element.innerHTML;
        var newHtml = '<div class="' + clazz + '" id="' + id + '" >' + theHtml + '</div>';
        element.innerHTML = newHtml;
        //item.setAttribute("data-section-num", i);

    }



    my.number = function (nodeList) {
        //        my.tag(nodeList, "data-section-num", function (i) {
        //            return i;
        //        });
        state.numSlides = nodeList.length;

        for (var i = 0; i < state.numSlides; ++i) {
            var item = nodeList[i]; // Calling myNodeList.item(i) isn't necessary in JavaScript
            my.wrapDiv(item, "slide-" + i, "slide");
            var childSlides = my.selects("section[data-slide]", item);
            my.tag(childSlides, "data-sub-slide");

        }
    };

    my.toggleMode = function () {
        state.toggleMode();
        var slideWall = document.getElementById("slideWall");
        my.classed(slideWall, "slide-backdrop", state.isDeck());

        var slideHolder = document.getElementById("slideHolder");
        my.classed(slideHolder, "slide-holder", state.isDeck());

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
                    var prevEl = document.getElementById(state.slideName());
                    my.classed(prevEl, "slide-box", false);
                    window.location.hash = state.previous(); //side effect on state
                    if (state.isDeck()) {
                        my.classed(document.getElementById(state.slideName()), "slide-box", true);
                    }
                    break;
                case 39:
                    console.log("Next " + evt.keyCode);
                    var prevEl = document.getElementById(state.slideName());
                    my.classed(prevEl, "slide-box", false);
                    window.location.hash = state.next(); // side effect on state
                    if (state.isDeck()) {
                        my.classed(document.getElementById(state.slideName()), "slide-box", true);
                    }
                    break;
                case 83:
                    if (evt.shiftKey) {
                        console.log("toggle mode: " + state.mode);

                        my.toggleMode();
                        var currEl = document.getElementById(state.slideName());
                        if (state.isDeck()) {
                            window.location.hash = state.slideName();
                            my.classed(currEl, "slide-box", true);
                        } else {
                            my.classed(currEl, "slide-box", false);
                        }
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
        b.appendChild(slideHolder);


    }

    return my;
}; //closure
