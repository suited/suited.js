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
/**
 * Lifecycle events that get fired and the handlers and
 * mechanisms to register a new handlers or add new events into the lifecycle
 *
 * Also the overall event fireing mechanism. //TODO should that be in State?
 *
 * There are some default events that will be fired like before and after StateChange
 * or before and after Mode change.
 *
 * There are some default handlers too
 */



//constructor Func
var LifeCycle = function () {

  var self = this;
  /**
   * Supported Events
   **/
  var lifecycleEvents = [
  "BeforeInit",
  "AfterInit",
  "BeforeStateChange",
  "AfterStateChange",
  "BeforeModeChange",
  "AfterModeChange"
];

  //TODO FIXME do we need another list for Custom Events that can be added to hook locations?

  //create map to lookup lifecycleEvents... this is so
  // a client can only get lifecycle name from this map
  // eveftivly this is an enum
  var eventLookup = (function () {
    var ret = {};
    lifecycleEvents.forEach(function (d, i, a) {
      ret[d] = d;
    });
    return ret;
  })();

  // I want to be able to fire Plugin transformation actions on Page change

  //initialise event handlers array for each event
  var eventHandlersLookup = (function () {
    var ret = {};
    lifecycleEvents.forEach(function (d, i, a) {
      ret[d] = [];
    });
    return ret
  })();

  this.lookupHandlers = function (eventName) {
    return eventHandlersLookup[eventName];
  }

  /**
   * event name is a name in lifecycleEvents
   * handlerCallback is a function of the form???

   * returns handlerID : NB you must remember the eventName (hint it's in the id for efficient removal)
   **/
  this.registerHandler = function (eventName, handlerCallback) {
    var realEventName = eventLookup[eventName];
    if (!!realEventName) {
      //we made sure the event exists in our supported event list
      var ehanders = eventHandlersLookup[eventName];
      var id = ehanders.length; //id used to help remove it //TODO FIXME should create a UUID as array length may shrink on removal
      var ehId = eventName + "-" + id++; //to make sure it is a new value next time
      ehanders.push({
        "id": ehId,
        "callback": handlerCallback
      });
      return ehId;
    } else {
      console.warn("Attempt to register a Hnadler with an unsuported event: '" + eventName + "'");
    }
  }

  //returns the handler  so you can run its callback manually
  // returns null if not found.
  this.lookupByHandlerId = function (handlerId) {

    var ret = null;

    //iterate with for loop so we can terminate early
    done_outer:
      for (var i = 0; i < lifecycleEvents.length; i++) {
        var handlers = eventHandlersLookup[lifecycleEvents[i]];
        //iterate the handlers array for the event looking for a handler with id === handlerId
        done_inner:
          for (var j = 0; j < handlers.length; j++) {
            var h = handlers[j];
            if (h.id === handlerId) {
              ret = h.callback;
              break done_outer;
            }
          }
      }


    return ret;
  }

  this.deregisterHandler = function (handlerId) {
    //iterate events looking for one that has a handler of this id and delete it then short circuit return
    //iterate with for loop so we can terminate early
    done_outer: for (var i = 0; i < lifecycleEvents.length; i++) {
      var handlers = eventHandlersLookup[lifecycleEvents[i]];
      //iterate the handlers array for the event looking for a handler with id === handlerId
      done_inner:
        for (var j = 0; j < handlers.length; j++) {
          var h = handlers[j];
          if (h.id === handlerId) {
            if (j > -1) {
              handlers.splice(j, 1);
            }
            break done_outer;
          }
        }
    }
  }

  this.events = Array.prototype.slice.call(lifecycleEvents);

  this.fireEvent = function (eventName) {
    var handlers = eventHandlersLookup[eventName];
    handlers.forEach(function (d, i, a) {
      var x = d.callback(i);
      console.log("running callback " + i + " whose id is " + d.id + " where ret = " + x);
    });
  }

}

//return the contructor function
module.exports = LifeCycle
