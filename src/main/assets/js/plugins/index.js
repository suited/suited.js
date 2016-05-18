'use strict';

var builtins = [];

builtins.push(require("./markdown").plugin);
builtins.push(require("./slideChange"));

module.exports = {
  "builtins": builtins
  , "markdownPlugin": require("./markdown").plugin
  , "slideChangePlugin": require("./slideChange")
}