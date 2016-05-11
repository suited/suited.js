'use strict';

var k = require('../../main/assets/js/konstantes.js');
var Plugin = require('../../main/assets/js/plugin.js');

describe("Suited API tests.", function () {

  afterEach(function () {
    // runs after each test in this block
    //    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    //    var lc = new LifeCycle();
    //    var es = lc.events;
    //    //lookup handlers for es[0] and assert it has no handlers.
    //    var e0hs = lc.lookupHandlers(es[0]);
    //    expect(e0hs).to.be.empty;
  });


  it("Plugins return a modified state if one is passed in", function () {
    var p1 = "fixme"
    expect(p1).to.equals("muppet");
  });

});
