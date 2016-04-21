'use strict';


var k = require('../../main/assets/js/konstantes.js');

describe("Lifecycle API tests.", function () {

  afterEach(function () {
    // runs after each test in this block
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();
    var es = lc.events;
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = lc.lookupHandlers(es[0]);
    expect(e0hs).to.be.empty;
  });


  it("A handler can be added to an event", function () {
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();
    var es = lc.events;
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = lc.lookupHandlers(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle = lc.registerHandler(es[0], function () {
      console.log("dummy callback 1");
    });
    var e0hs2 = lc.lookupHandlers(es[0]);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(1);
    e0hs2[0].callback(); //run it
  });

  it("A handler can not be added to non existant event", function () {
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();

    var handle = lc.registerHandler("nosuchevent", function () {
      console.log("bad callback 2");
    });
    var e0hs = lc.lookupHandlers("nosuchevent");
    expect(e0hs).to.be.empty;

  });

  it("An event can have more than one handler and ", function () {
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();
    var es = lc.events;
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = lc.lookupHandlers(es[0]);
    expect(e0hs).to.be.empty;
    for (var i = 0; i < 4; i++) {
      lc.registerHandler(es[0], function (x) {
        return x;
      });
    }

    var e0hs2 = lc.lookupHandlers(es[0]);
    expect(e0hs2).to.have.lengthOf(4);
  });

  it("An event handlers fire in the prescribed order, by default in the order they were added", function () {
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();
    var es = lc.events;
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = lc.lookupHandlers(es[0]);
    expect(e0hs).to.be.empty;
    for (var i = 0; i < 4; i++) {
      lc.registerHandler(es[0], function (x) {
        return x;
      });
    }

    var e0hs2 = lc.lookupHandlers(es[0]);
    expect(e0hs2).to.have.lengthOf(4);
    e0hs2.forEach(function (d, i, a) {
      var x = d.callback(i);
      console.log("running callback " + i + " whose id is " + d.id + " where ret = " + x);
      assert.equal(d.id, "" + es[0] + "-" + i);
    });
  });

  it("A handler can be deregistered from an event using the handler id", function () {
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();
    var es = lc.events;
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = lc.lookupHandlers(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 1");
    });
    var handle2 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 2");
    });
    var handle3 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 3");
    });
    var e0hs2 = lc.lookupHandlers(es[0]);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(3);

    //deregister a handler 
    lc.deregisterHandler(handle2);

    var e0hs3 = lc.lookupHandlers(es[0]);
    expect(e0hs3).to.have.lengthOf(2);

    //test that 1 AND 3 ARE STILL VALID
    var h1 = lc.lookupByHandlerId(handle1)
    expect(h1).not.to.equal(null);

    var h2 = lc.lookupByHandlerId(handle2)
    expect(h2).to.equal(null);

    var h3 = lc.lookupByHandlerId(handle3)
    expect(h3).not.to.equal(null);


  });

  it("A handler can be deregistered from an event using the handler id first handler", function () {
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();
    var es = lc.events;
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = lc.lookupHandlers(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 1");
    });
    var handle2 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 2");
    });
    var handle3 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 3");
    });
    var e0hs2 = lc.lookupHandlers(es[0]);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(3);

    //deregister a handler 
    lc.deregisterHandler(handle1);

    var e0hs3 = lc.lookupHandlers(es[0]);
    expect(e0hs3).to.have.lengthOf(2);

    //test that 1 AND 3 ARE STILL VALID
    var h1 = lc.lookupByHandlerId(handle1)
    expect(h1).to.equal(null);

    var h2 = lc.lookupByHandlerId(handle2)
    expect(h2).not.to.equal(null);

    var h3 = lc.lookupByHandlerId(handle3)
    expect(h3).not.to.equal(null);


  });

  it("A handler can be deregistered from an event using the handler id last handler", function () {
    var LifeCycle = require('../../main/assets/js/lifecycle.js');
    var lc = new LifeCycle();
    var es = lc.events;
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = lc.lookupHandlers(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 1");
    });
    var handle2 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 2");
    });
    var handle3 = lc.registerHandler(es[0], function () {
      console.log("dummy callback 3");
    });
    var e0hs2 = lc.lookupHandlers(es[0]);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(3);

    //deregister a handler 
    lc.deregisterHandler(handle3);

    var e0hs3 = lc.lookupHandlers(es[0]);
    expect(e0hs3).to.have.lengthOf(2);

    //test that 1 AND 3 ARE STILL VALID
    var h1 = lc.lookupByHandlerId(handle1)
    expect(h1).not.to.equal(null);

    var h2 = lc.lookupByHandlerId(handle2)
    expect(h2).not.to.equal(null);

    var h3 = lc.lookupByHandlerId(handle3)
    expect(h3).to.equal(null);


  });

});
