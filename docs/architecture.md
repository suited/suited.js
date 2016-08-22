<!--
@Author: Roberts Karl <robertk>
@Date:   2016-Aug-07
@Project: suited
@Last modified by:   dirk
@Last modified time: 2016-08-22T23:34:33+10:00
@License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under this License.

-->



# Architecture

### Overview

This document provides an architectural overview of Suited. It describes the different components that make up Suited and references more detailed descriptions where necessary. Suited is loaded from `core.js`, which is responsible for catching and distributing browser events as well as loading and interpreting the configuration.

While [`suited`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/suited.js) is mostly event based some state is managed in a [`State`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/state.js) object that `suited` maintains.

### Events

Suited is event based. All browser events are mapped into suited events. All event handling is done by plugins, which are registered with the  [`dispatch`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/dispatch.js) object when loaded.

The [`dispatch`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/dispatch.js) sends events to all plugins that have registered a callback for that event. [`Plugin`'s](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugin.js) can also fire events for others to consume.

The framework generates some lifecycle events and there are some core runtime events related to default features such as changing Mode or slide. Lifecycle events are useful if you want your plugin to run some code or transform the document after other transformations have run, for instance the Markdown plugin listens to the `PluginsLoaded` event and then walks the document transforming markdown into html, it wants the other plugins to be loaded as they may introduce extra DOM elements that need to be taken into account.

### Lifecycle Events
* `ConfigLoaded`:- Configuration has been been consolidated, defaults merges with user supplied overrides.
* `PluginsLoaded`:- All plugins have been loaded.
* `BeforeSlideChange`:- slide about to change.
* `AfterSlideChange`:- slide has changed.
* `BeforeModeChange`:- Mode is about to change.
* `AfterModeChange`:- Mode has changed.
* TODO - not all specified yet.

### Runtime Events
* `LocationChanged`:-
    - effect:- Updates the URL so bookmarking works and slides have unique REST addresses.
    - fired whenever the `suited.state` has the current slide number changed.
    - usually fired by the builtin plugins such as `SlideChangePlugin` but also fired when Modes are changed to update the URL
* `SetMode`:-
    - eventdata:- {"modeName": a_mode_name}
    - effect:- change to named mode
* `NextMode`:-
    - effect:- change to next mode
* `SetModeNum`:-
    - eventdata:- {"modeNum": a_mode_number}
    - effect:- change to next mode

#### Reserved key events
The [`core.js`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/core.js) listens to browser events such as key presses and clicks for the core features. The handlers simple fire `suited` events for the built-in plugins to handle. While you can also add a plugin to listen to these `suited` events should not attempt to change the browser event handlers for these keys.

##### Key listeners
* "left arrow"
    - fires:-
        - `BeforeSlideChange`
        - `GoBack`
        - `AfterSlideChange`
    - effect:- go to previous slide or figure.
* "right arrow"
    - fires:-
        - `BeforeSlideChange`
        - `GoForward`
        - `AfterSlideChange`
    - effect:- go to next slide or figure.
* "s"
    - fires:-
        - `NextMode`
        - `LocationChanged` passing in current state
    - effect:- switch to next mode.
* "1 -> 9"
    - fires:-
        - `SetModeNum` with eventdata {"modeNum": num}
    - effect:- change to mode of same number
* "SHIFT+t"
    - fires:-
        - `LocationChanged`
    - effect:- go to top of document
* "escape key"
    - fires:-
        - `ESC`
    - effect:- jump back to default doc mode.
* "enter key"
    - fires:-
        - `ENTER`
* "any other key press"
    - fires:-
        - "KEY_PRESSED_" + javascript key code
          - e.g. KEY_PRESSED_90 key 'z' pressed

##### click listeners
* 'left mouse click'
    - fires:-
        - `CLICK`:-
            - eventdata:- the browser click event
            - effect:- not specified

##### mouse move listeners
* 'mouse moved'
    - effect:- sets the `suited.mouseX` and `suited.mouseY` variables


### Plugins
Plugins are the workhorses of `suited`.
They listen to events and modify the display of the document.

A plugin defines callbacks for events.

Plugins must have a unique `name` if two have the same name then the second one loaded will replace the first.

Plugins must have a 'registerCallbacks(dispatch)' and a 'deregisterCallbacks(dispatch)' method or function that calls `dispatch.on(eventName, callback)``

It is recomended that you use plugin.js's [`new Plugin(name)`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugin.js) constructor then this will all be taken care of for you.

When Suited adds a plugin it first tests that `registerCallbacks` adds callbacks and `deregisterCallbacks`
completely removes them before allowing the plugin to be added.

If your plugin uses plugin.js's [`new Plugin(name)`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugin.js) constructor then it will also have the `addCallback(eventname, callbackFunc, valueHandler)` function, where valueHandler is optional, which can be used to add a callback for an event to a plugin.

A Callback is a `function(state, eventData)`. [`state`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/state.js) is an object managed by suited and has an [`API`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/state.js)

Both state and eventData are optional, but if the callback modifies the state (by using the State API),
then it must return an object that contains the new state,
eg return `{state: someNewState}``

Many callbacks may be called in turn for a particular event, The `dispatch` makes sure that the state returned is
passed to the next callback.

In addition to returning state, a callback may return a value
eg return {state: somestate, value: calculation }

Normally nothing will be done with that value, however if you wish to handle It then you
can supply an optional 3rd parameter to Plugin.addCallback(). The 3rd parameter is a "valueHandler'
function. It expects to be passed the callback's return object and can then extract the value and do whatever it needs to do with it.


#### Built-in Plugins
* `LocationManagerPlugin`
    - Fixes the URL after a mode or slide change.
    - listens to:- `LocationChanged` event.
* `MarkdownPlugin`
    - renders markdown in data-markdown elements to HTML
    - listens to:- `PluginsLoaded` event.
* `SlideChangePlugin`
    - modifies `state` to reflect the next navigable slide and fires the currentMode's transition function.
    - listens to:- `GoBack` and `GoForward` event.
    - fires:- `LocationChanged`
* [`ModePlugin`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugins/modes/modePlugin.js)
    - responsible for setting the current `Mode` and setting up a &lt;style&gt; place-holder for Modes to attach custom style to.
    - listens to:- `NextMode`, `PrevMode`, `SetMode`, `SetModeNum` and `ESC`
    - fires:- `BeforeModeChange`, `AfterModeChange` to allow modes to set-up and tear-down DOM or style changes that they make.
    - fires:- `BeforeSlideChange` and `AfterSlideChange` to allow the Mode to dress the current slide as if it had just been transitioned to rat in the new Mode rather than simply changing mode.
    - fires:- `ModeCSSFree` to let the new mode that the previous modes style placehoder has been cleaned up and it is free to add style if it chooses.
    - fires `LocationChanged` in the event of receiving `ESC` because it not only changes to default mode but moves the navigation pointer back to the top of the document.

  Technically the built-in Modes are also plugins but they will be discussed below.

#### Modes

[`Mode`'s](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugins/modes/mode.js) are responsible for the look and feel of the document.

Technically they are plugins and extent from [Plugin](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugin.js) but rather than all being loaded/registered with `suited` only one Mode is loaded at a time by the [`ModePlugin`](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugins/modes/modePlugin.js).

Being plugins, they must have unique names, and their actions are triggered by registering callbacks to the life-cycle events. However they are special plugins and must also define a transition function that is fired when moving from one slide to the next.

Modes are plugins and can also add callbacks for custom events that they may actually fire themselves in their normal function. For example the `lecture` mode listens the the default Life-cycle events but also listens to the CLICK event and ENTER upon which it zooms the document.

It is recommended that you you create your own modes using:

```
new Mode(modeName, fnBeforeSlideChange, fnAfterSlideChange, fnBeforeModeChange, fnAfterModeChange, fnCleanUp, fnShouldShowslide, arrTransitions)
```
[See mode.js](https://github.com/suited/suited.js/blob/master/src/main/assets/js/plugins/modes/mode.js). All but modeName parameter are optional parameters, but if nothing is supplied it will be a boring Mode.

`fnBeforeSlideChange`, `fnAfterSlideChange`, `fnBeforeModeChange`, `fnAfterModeChange` are plugin callbacks that fire on the life-cycle events `BeforeSlideChange`, `AfterSlideChange`, `BeforeModeChange` and `AfterModeChange` respectively. If null then the mode performs no action on those events. Common actions would be changing the style or class of the new and old slides to modify the display or adding extra DOM elements to the document as needed by the mode or its transitions.

`fnCleanUp` should remove and trace that the Mode existed reverting the document to its state before the Mode was applied.

`fnShouldShowslide` is a predicate function that returns true if a slide is to be displayed, if false the navigation will skip it and move to the next. While this could be fancy and run different rules for each slide or consult state to determine if a slide is to display, the default Modes only use it to discriminate between `data-figure` and `data-slide` `&lt;section&gt;'s`. Most Modes only display the `data-figure` sections while `deck` mode is the slide deck and shows both. In this way it is possible to add slides to the deck that don't show up in the `doc` view of the document. If this function is null then all are displayed by that mode.

`arrTransitions` is an array of transition objects that the mode supports, with the first one being a default.

##### Mode transitions.
A transition object is used to swap slides, it had functions that handle the swap direction and looks like:-
```
{
  "name": "unique_name_in_mode",
  "top": function goToTopOfDoc(),
  "left": function goToPreviousSlide(),
  "right" function goToNextSlide(),
  "up": function goUpaSlide(),
  "down": function goDownASlide()
}
```

If no transitions are specified then the default "scroll" transition is used.

The transition used is either the Mode's default or the one specified in suited.config for the Mode or one specified by name in the "transition" attribute of a slide section. If a mode supports that named transition and displayed that slide it will use the specified transition whenever it transitions to that slide. eg.

```
<section data-figure transition="jump">
    <img src="images/jackOfSpades.png" width="60%" />
</section>
```

##### Builtin Modes
* `doc`
    - intent:- display the document as a normal document.
    - doesn't modify the DOM or style and displays all elements but only data-figure slides.
    - default "scroll" transition.
* `deck`
    - slide deck mode.
    - displays ONLY the data-figures and data-slides.
    - intent:- present as aslide show for a talk or meetup.
    - default "jump" transition
* `walkthrough`
    - like doc but add a highlight background to each data-figure as it navigates to it.
* `lecture`
    - intent: allow a lecturer to walk through a document discussing it.
    - like `doc` but
    - listens to: "CLICK" event:- zooms the element clicked.
    - listens to: "ENTER" event:- zooms the currently navigated to slide.
