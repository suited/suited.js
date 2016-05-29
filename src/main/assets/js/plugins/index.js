'use strict';

var builtins = [];

builtins.push(require("./markdown").plugin);
builtins.push(require("./slideChange"));

modePlugin = require("./modes").plugin;
builtins.push(modePlugin);

module.exports = {
  "builtins": builtins
  , "markdownPlugin": require("./markdown").plugin
  , "slideChangePlugin": require("./slideChange")
  , "modePlugin" : modePlugin    
}