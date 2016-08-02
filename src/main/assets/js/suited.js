/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   Karl_Roberts
* @Last modified time: 2016-Aug-02
* @License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

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
    log: true,
    transition: undefined // name of default transition... TODO should add this to Mode - Plugin config
  };

  var plugins = [];

  var modes = [];

  //just know where the mouse is.
  var mouseX = 0;
  var mouseY = 0;

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
        console.log("Unverified Plugin '" + p.name + "' hasListeners="+hasListeners + "  removedListenrs="+removedListeners);
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
      console.log("Suited: adding Plugin: " + p.name)
      plugins.push(p);
      console.log("Suited: registering Plugin: " + p.name)
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
        console.log("Suited: Deregistering Plugin: "+plugins[d].name);
        plugins[d].deregisterCallbacks(dispatch);
        plugins.splice(d, 1);
      }
    });
  }

  this.fireEvent = function (eventName, state, eventData) {
    dispatch(eventName, state, eventData);
  }
}

module.exports = Suited
