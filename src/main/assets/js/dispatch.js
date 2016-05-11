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
var Dispatch1 = function () {

  var self = this;

  //initialise event handlers array for each event
  var eventListenersMap = {};

  //map 
  this.listeners = function (eventName) {
    return eventListenersMap[eventName];
  }

  /**
   * event name is a name in lifecycleEvents
   * handlerCallback is a function of the form???
   
   * returns handlerID : NB you must remember the eventName (hint it's in the id for efficient removal)
   * if you supply an existing id it replaces the listener
   **/
  this.registerListener = function (eventName, handlerCallback, callbackid) {

    // console.log("aaaaaaaaaaaaaa registerListener eventName:" + eventName + ", handlerCallback: " + handlerCallback + ",   callbackid: " + callbackid)
    var createId = true;
    //PRECONDITION
    if (!eventName || !handlerCallback) return; // do nothing
    if (!!callbackid) createId = false;
    //    if (!createId) {
    //      console.log("<><><>< hahah callbackid = " + callbackid);
    //    }

    //we made sure the event exists in our supported event list
    var ehanders = eventListenersMap[eventName];
    if (!ehanders) {
      //create a new place in the map, its an array cause we can have more listeners fot the event
      eventListenersMap[eventName] = [];
      ehanders = eventListenersMap[eventName];
    }

    var id = ehanders.length;
    var theId = (createId) ? eventName + "-listener-" + id++ : callbackid;

    //replace or append the listener
    // if we need a new name than we are always appending
    // only check if we have a name
    if (createId) {
      //      console.log(">>>>>>>>>>>>>>   must createId");
      //      console.log("aaaaaaaaaaaaaaa   appending id: " + theId + " func with  " + handlerCallback);
      ehanders.push({
        "id": theId,
        "listener": handlerCallback
      })
    } else {
      //      console.log(">>>>>>>>>>>>>>   must NOT createId");
      // see if append or replace
      var cbIndex = ehanders.map(function (d, i, a) {
        return d.id;
      }).indexOf(theId)

      if (cbIndex === -1) {
        //doesn't exist so append
        //        console.log("aaaaaaaaaaaaaaa   appending id: " + theId + " func with  " + handlerCallback);
        ehanders.push({
          "id": theId,
          "listener": handlerCallback
        })
      } else {
        // replace it
        //        console.log("rrrrrrrrrrrrr   replacing id: " + theId + " func with  " + handlerCallback);
        ehanders[cbIndex] = {
          "id": theId,
          "listener": handlerCallback
        }
      }
    }
    //
    return theId;
  }

  //returns callback function of listener listenerId
  // returns null if not found.
  this.getCallback = function (listenerId) {
    var ret = null;
    var es = self.events();

    //iterate with for loop so we can terminate early
    done_outer:
      for (var i = 0; i < es.length; i++) {
        var handlers = eventListenersMap[es[i]];
        //        console.log("i =" + i + "  es=" + JSON.stringify(es) + " handlers= " + JSON.stringify(handlers))
        //iterate the handlers array for the event looking for a handler with id === listenerId
        done_inner:
          for (var j = 0; j < handlers.length; j++) {
            var h = handlers[j];
            if (h.id === listenerId) {
              ret = h.listener;
              break done_outer;
            }
          }
      }

    return ret;
  }

  this.deregisterListener = function (handlerId) {
    //iterate events looking for one that has a handler of this id and delete it then short circuit return
    //iterate with for loop so we can terminate early
    var es = self.events();

    done_outer: for (var i = 0; i < es.length; i++) {
      var handlers = eventListenersMap[es[i]];
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

  this.events = function () {
    return Array.prototype.slice.call(Object.keys(eventListenersMap));
  }

  this.dispatch = function (eventName, state, eventData) {
    var theState = state;
    //TODO should I fail if state doesn't exist?

    var ls = self.listeners(eventName);
    //    console.log("<><><><><>< ls.length is = " + ls.length);

    if (true) {
      ls.forEach(function (l, i, a) {
        //        console.log("ooooooooooooooooo i=" + i + " a = " + a)
        //        console.log("<><><><><><>>>>>>>>>>   ls[" + i + "].id = " + l.id + "  ls[" + i + "].listener= " + l.listener);
        //
        //
        //        console.log(".......... running callbacks " + i + " whose id is " + l.id);
        var f = l.listener;

        function whatIsIt(object) {

          let stringConstructor = "test".constructor;
          let arrayConstructor = [].constructor;
          let objectConstructor = {}.constructor;

          if (object === null) {
            return "null";
          } else if (object === undefined) {
            return "undefined";
          } else if (object.constructor === stringConstructor) {
            return "String";
          } else if (object.constructor === arrayConstructor) {
            return "Array";
          } else if (object.constructor === objectConstructor) {
            return "Object";
          } else if (typeof f === "function") {
            return "WOOOOOOOOT f is a function";
          } else {
            return "don't know";
          }
        }

        //        console.log("[[[[[[[[[[[[  " + whatIsIt(f));


        var answer = f(theState, eventData); //pass in threaded state

        console.log("seen answer: " + JSON.stringify(answer));
        //        var answer = "foo" //l.listener(state, eventData);
        //TODO FIXME should I build a result array and pass it back to suited to rub
        // valueHandlers? or do it here?
        if (!!answer.value) {
          //handle the result ??? should I? its a callback should be void really.
          console.log("seen answer.value: " + JSON.stringify(answer.value));
        }
        theState = (!!answer.state) ? answer.state : theState; //use new state if it is returned else use existing state
      });

    } else {
      console.log("No listenrs found for event:- " + eventName);
    }


  }

}

function Dispatch() {
  var internaldispatch = new Dispatch1();
  var ret = function (eventName, state, eventData) {
    internaldispatch.dispatch(eventName, state, eventData);
  }

  ret.events = internaldispatch.events;
  ret.off = internaldispatch.deregisterListener;
  ret.on = internaldispatch.registerListener;
  ret.listeners = internaldispatch.listeners;
  ret.getCallback = internaldispatch.getCallback;

  return ret;
}

//return the contructor function
module.exports = Dispatch
