/* Core features and management - eg finds and tags all slide elements */
function core() {

    var state = {};

    //the currently selected section
    state.current = 0;

    state.next = function () {
        state.current++;
        return "slide-" + state.current;
    }

    state.previous = function () {
        state.current--;
        return "slide-" + state.current;
    }


    var toplevel = [];



    var my = function () {};

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



        for (var i = 0; i < nodeList.length; ++i) {
            var item = nodeList[i]; // Calling myNodeList.item(i) isn't necessary in JavaScript
            my.wrapDiv(item, "slide-" + i, "slide");
            var childSlides = my.selects("section[data-slide]", item);
            my.tag(childSlides, "data-sub-slide");

        }
    };

    my.top

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
                    window.location.hash = state.previous();
                    break;
                case 39:
                    console.log("Next " + evt.keyCode);
                    window.location.hash = state.next();
                    break;

            };

        };
    };



    my.init = function () {
        my.number(my.selects("section[data-slide]"));
        my.key();
    }

    return my;
}; //closure
