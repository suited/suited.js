<!--
@Author: Roberts Karl <Karl_Roberts>
@Date:   2016-Aug-02
@Project: suited
@Last modified by:   Karl_Roberts
@Last modified time: 2016-Aug-02
@License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

-->



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
