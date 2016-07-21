### TODO's

This is for ideas before we get issues or tasks.

* dynamically change style or tag a `section` to swap the style on transition.

* Plugins (and Modes) should declare the events that they consume and emit to the dispatcher
  * the Dispatcher could check when a plugin or mode fires an event or  that it was declared.
  * not useful yet but it allows us to "secure" plugins and feature toggle if we depend on a event in another plugin
  * it is not declared anywhere
  
* Framework should convert all keystrokes into Key-Press-X suited events,,
allows us to have multiple handlers respond to browser events.

* Framwork should keep track of mouse position for zoom etc.

* Dispatch should maintain a queue of events... have a timer call processEventQueueBeforeAction()
* to eat a few in order.... prevents multithreading bugs and event misses on fast mousing