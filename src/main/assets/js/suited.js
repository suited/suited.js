'use strict';
//suited.js

var Dispatch = require('./dispatch.js');

var utils = require('./utils.js');

//Suited is the Object to put on Window so 
//TODO FIXME make suited itself extend Plugin just needs a plugins[] and fireEvent(eventName)

// plugins are objects that have a fireEvent(eventName) function. they can add new avent names by also having events.
var Suited = function suited(adispatcher) {

  var self = this;

  //this is the real event dispatcher
  if (!adispatcher) {
    // fail fast
    throw new Error("Suited(dispatch) was not passed a valid Dispatch.")
  }
  var dispatch = adispatcher;

  var myrunconfig = {
    log: true
  };

  var plugins = [];

  var modes = [];

  this.getPluginsByName = function (pluginName) {
    var ret = plugins.filter(function (p) {
      return (p.name === pluginName);
    });

    return ret;

  };

  /** 
   * Return list of unique plugin names
   **/
  this.getPluginNames = function () {
    var ret = plugins.map(function (p) {
      return p.name;
    });

    return utils.unique(ret);
  };

  /**
   * runconfig sets properties of suited run, eg turns on an of logging for all built in plugins 
   **/
  this.config = function (runconfig) {
    if (!!runconfig) {
      myrunconfig[log] = runconfig.log;
    }
  }

  //lowdash would be useful here to merge the objects, this is a temp hack
  /** plugins simply have a function called fireEvent(eventName) */
  this.verifyPlugins = function (pluginsArray) {
    pluginsArray = Array.prototype.slice.call(pluginsArray);

    var retArray = [];

    //test that it can register and deregister correctly else don't add it
    var allGood = pluginsArray.every(function (p, i, a) {
      var ret = true; // default OK
      //use a fake Dispatcher to test it.
      var fakeDispatch = new Dispatch();
      p.registerCallbacks(fakeDispatch);
      var dispatchEvents = fakeDispatch.events();

      var hasListeners = dispatchEvents.some(function (e, i, a) {
        var foundSome = fakeDispatch.listeners(e);
        if (!!foundSome && foundSome.length > 0) {
          return true;
        } else {
          return false;
        }
      });

      p.deregisterCallbacks(fakeDispatch);

      var stillGotListeners = dispatchEvents.some(function (e, i, a) {
        var foundSome = fakeDispatch.listeners(e);
        if (!!foundSome && foundSome.length > 0) {
          return true;
        } else {
          return false;
        }
      });

      var removedListeners = !stillGotListeners;

      //finally after testing we add the plugin to the plugins[]
      if (hasListeners && removedListeners) {
        console.log("Verified Plugin '" + p.name + "' ");
        retArray.push(p);
      } else {
        console.log("Unverified Plugin '" + p.name + "' ");
        ret = false;
      }

      return ret;
    });

    if (allGood) {
      console.log("All Plugins verified OK")
    } else {
      console.log("Not all Plugins were OK")
    }

    return retArray;

  }

  //test all plugins and add the good ones and register them
  this.addPlugins = function (wantedPluginsArray) {
    var goodPlugins = self.verifyPlugins(wantedPluginsArray);

    //register the good plugins with the dispatch
    //TODO should plugins be in an unregistered array first then add them to registered?
    goodPlugins.forEach(function (p, i, a) {
      console.log(",.,,.. adding " + JSON.stringify(p))
      plugins.push(p);
      console.log(",.,,.. regestering " + JSON.stringify(p))
      p.registerCallbacks(dispatch);
    })

    var allGood = (goodPlugins.length === wantedPluginsArray.length)
    if (allGood) {
      console.log("All Plugins were good.")
      console.log("Plugins are . " + JSON.stringify(plugins))
      return true;
    } else {
      console.log("Did not add all Plugins. Some failed verification")
      console.log("Plugins are . " + JSON.stringify(plugins))
      return false;
    }

  }

  // work from the back so as not to screw up the slice index
  this.removePlugin = function (pluginname) {
    var indexes = [];
    for (var i = (plugins.length - 1); i > -1; i--) {
      if (plugins[i].name === pluginname) {
        indexes.push(i);
      }
    }
    //now remove em from the back
    indexes.forEach(function (d) {
      if (d > -1) {
        plugins.splice(d, 1);
      }
    });
  }

  // deprecated by ModePlugin
//  //lowdash would be useful here to merge the objects, this is a temp hack
//  /* modes are simply plugins but passed to the addModes function */
//  this.addModes = function (modesArray) {
//    modesArray = Array.prototype.slice.call(modesArray);
//    modes = modes.concat(modesArray);
//  }


  this.fireEvent = function (eventName, state, eventData) {
    dispatch(eventName, state, eventData);
  }
}

module.exports = Suited
