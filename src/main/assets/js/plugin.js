'use strict';
//plugin.js

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
   
   * @param 'callbackFunc' is a function like this:- callback(state, eventdata)): {state: NewState, value: someValue}
   *   where 'eventData' is some data passed to the callback when the event fires.
   *   where 'state' is some value of the currentState object, usually passed in by the framework.
   *   
  *    The return object contains a new 'state' object if the callback changes the state, and a value if the callback produces a value.
         - the new state is returned from using  the state's api
   *   'valueHandler' is an optional param that can be used to deal with the return value of the callback if it has one.
   *   it will be passed back in the result of running the callback if it was supplied.
   *
   * @param valueHandler  is an optional function that is passed the result of the callback, to do further handling,
     - it should return an object that ??? what?
   *
   * @return {'state': newState, 'value': aValue, 'valueHandler', vhFunc}
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
      console.log("valueHandler::::::::: " + valueHandler);
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
    /*console.log("zzzzzz1 theeventCallbacks are" + JSON.stringify(theeventCallbacks))
console.log("zzzzzz11 handlers.length are " + handlers.length)

var testmyhandlers = theeventCallbacks[eventname]
console.log("testmyhandlers.length is:- " + testmyhandlers.length);
testmyhandlers.forEach(function (d, i) {
  console.log("zzzzzz1a cb " + i + " fun is" + d)
})*/
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
