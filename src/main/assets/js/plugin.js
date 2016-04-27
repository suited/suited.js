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
 * TODO should I allow the valueHandler to modify state? to pass back up the chain too?
 */
function Plugin(name) {
  var self = this;
  this.name = "unnamed";

  var theeventCallbacks = {};

  var theeventCallbackHandles = {};

  //PRecondition
  if (!name) {
    throw new Error("Bad constructor: Plugin(name) requires a name parameter.")
  }

  self.name = name;

  /**
   * Add a callback to the plugin.
   *
   * @param 'eventname' is the name of the event that the callback will be called for, when that event fires.
   
   * @param 'callbackFunc' is a function like this:- callback(state, eventdata))
   *   where 'eventData' : Optional. is some data passed to the callback when the event fires.
   *   where 'state' : Optional. is some value of the currentState object, usually passed in by the framework.
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
      //      console.log("valueHandler::::::::: " + valueHandler);
      var f = function (state, eventdata) {
        //        console.log("%%%%%%%%%%%  state" + JSON.stringify(state));
        var v = callbackFunc(state, eventdata);
        //        console.log("%%%%%%%%%%%  v" + JSON.stringify(v));
        var vv = valueHandler(v);
        //        console.log("%%%%%%%%%%%  vv" + JSON.stringify(vv));
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
    var events = Object.keys(theeventCallbacks);
    events.forEach(function (e, i, a) {
      //setup placeholder for handlerIds
      var handlerIds = theeventCallbackHandles[e]
      handlerIds.forEach(function (h, i, a) {
        dispatch.off(h);
      });

      theeventCallbackHandles[e] = []; //reset

    });
  }

}

//Export the constructor function.
module.exports = Plugin;
