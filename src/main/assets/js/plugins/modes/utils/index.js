let utils = {};

utils.getShouldShowSlideFunction = function (mode) {
    if (mode === "deck") {
        return function (slideType) {return slideType === "figure" || slideType === "slide";}
    }
    else {
        return function (slideType) {return slideType === "figure";}
    }
}

export default utils;