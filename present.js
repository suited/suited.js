/*
up vote
248
down vote
accepted
arrow keys are only triggered by onkeydown, not onkeypress

keycodes are:

left = 37
up = 38
right = 39
down = 40
*/


var pageElems = document.getElementsByTagName('section')

document.onkeyup = function(evt) {
    var kc = evt.keyCode;
    if (kc == 37) {
        console.log("Previous " + evt.keyCode);
    }
    if (kc == 39) {
        console.log("Next " + evt.keyCode);
    }
};