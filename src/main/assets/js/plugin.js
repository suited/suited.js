/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   robertk
* @Last modified time: 2016-Aug-14
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
//plugin.js

/**
 * A plugin defines callbacks for events.
 * Plugins must have a 'registerCallbacks(dispatch)' and a 'deregisterCallbacks(dispatch)' method or function.
 *
 * When Suited adds a plugin it first tests that register adds callbacks and deregister
 * compleatly removes them before allowing the plugin to be added.
 *
 * A Callback is a function(state, eventData). Both state and eventData are optional,
 * But if the callback modifies the state (by using the State.api),
 * then it must return an object that contains the new state,
 * eg return {state: someNewState}
 *
 * Many callbacks may be called in turn for a particular event, The Dispatch makes sure that the state returned is
 * passed to the next callback.
 *
 * In addition to returning state, a callback may return a value
 * eg return {state: somestate, value: calculation }
 *
 * Normally nothing will be done withthat value, however if you wish to Handle It then you
 * can supply an optional 3rd parameter to Plugin.addCallback(). The 3rd parameter is a "valueHandler'
 * function. It expects to be passed the callbacks return object and can then extract the .value and does stuff to it.
 *
 * @param name:String manditory plugin name, must be unique.
 * @param config:Object:Any Optional plugin config see specific plugin for valid values.
 * TODO should I allow the valueHandler to modify state? to pass back up the chain too?
 */
function Plugin(name, config) {
  var self = this;
  this.name = "unnamed";



  //user specified config, plugin instance may use or ignore this.
  //should be documented by the plugin.
  var runconfig = {};

  var theeventCallbacks = {};

  var theeventCallbackHandles = {};

  //PRecondition
  if (!name) {
    throw new Error("Bad constructor: Plugin(name) requires a name parameter.")
  }

  self.name = name;
  self.config = config || {};

  /**
   * Add a callback to the plugin.
   *
   * @param 'eventname' is the name of the event that the callback will be called for, when that event fires.

   * @param 'callbackFunc' is a function like this:- callback(state, eventdata))
   *   where 'state' : Optional. is some value of the currentState object, usually passed in by the framework.
   *   where 'eventData' : Optional. is some data passed to the callback when the event fires.
   *
   *   The return object from the callback contains a new 'state' object
   *   if the callback changes the state, and a value if the callback produces a value.
   *     - the new state is returned from using  the state's api
   *     - eg : {state: newState, value: someValue}
   *
   * @param valueHandler  is an optional function that is passed the result of the callback.
   *  - it can handle the resulting 'value' from a callback to do further handling,
      - The Dispatch will force it to return the callbacks state value
      TODO should the valueHandler be allowed to change state too? maybe?
   *
   * @return void
   *
   * the framework that calls callbacks will most likely call them one after each other, passing in state and returning it is a way to thread state changes though
   * the chain (like a State Monad).
  **/
  this.addCallback = function addCB(eventname, callbackFunc, valueHandler) {
    var cbs = theeventCallbacks[eventname];
    if (cbs === undefined || cbs === null) {
      theeventCallbacks[eventname] = [];
      cbs = theeventCallbacks[eventname];
    };

    //    handlers = Array.prototype.slice.call(handlers); //coerve to Array
    if (!valueHandler) {
      cbs.push(callbackFunc);
    } else {
      var f = function (state, eventdata) {
        var v = callbackFunc(state, eventdata);
        var vv = valueHandler(v);
        var ret = {};
        if (!!v && !!v.state) {
          ret.state = v.state;
        }
        if (!!vv && !!vv.value) {
          ret.value = vv.value;
        }

        return ret;
      };

      cbs.push(f);
    }

  }

  this.eventcallbacks = function () {
    return theeventCallbacks;
  }

  this.callbacks = function (eventname) {
    return theeventCallbacks[eventName];
  }

  this.events = function () {
    return Array.prototype.slice.call(Object.keys(theeventCallbacks));
  }

  //Register thisplugins callbacks with the dispatcher
  // NB need to capture the handleID that is returned for each as we need to be able to deregister the callbacks
  this.registerCallbacks = function (dispatch) {
    var events = Object.keys(theeventCallbacks);
    events.forEach(function (e, i, a) {
      //setup placeholder for handlerIds
      var handlerIds = theeventCallbackHandles[e]
      if (!handlerIds) {
        theeventCallbackHandles[e] = [];
        handlerIds = theeventCallbackHandles[e]
      };

      //      console.log("hhhhhhhhhhhhh  theeventCallbacks[" + e + "] = " + theeventCallbacks[e]);
      var cbs = theeventCallbacks[e];
      cbs.forEach(function (cb) {
        var cbHandle = dispatch.on(e, cb); //dispatch.on(eventname, callback, callbackId)
        handlerIds.push(cbHandle);
      })

    });
  }

  this.deregisterCallbacks = function (dispatch) {
    console.log("Plugin.deregisterCallbacks for "+ self.name);
    var events = Object.keys(theeventCallbacks);
    events.forEach(function (e, i, a) {
      // console.log("Plugin.deregisterCallbacks for event "+ e + "  for "+ self.name);
      //setup placeholder for handlerIds
      var handlerIds = theeventCallbackHandles[e]
      handlerIds.forEach(function (h, i, a) {
        // console.log("Plugin.deregisterCallbacks removing handler "+ h + " for event "+ e + "  for "+ self.name);
        dispatch.off(h);
      });

      theeventCallbackHandles[e] = []; //reset

    });
  }

  /**
   * user specified config, plugin instance may use or ignore this.
   * should be documented by the plugin.
   **/
  this.config = function(configObject) {
    if(arguments.length) {
      //sette
      runconfig = Object.assign({}, runconfig, configObject)
    } else {
      //getter
      return runconfig;
    }
  }

}

//Export the constructor function.
module.exports = Plugin;
