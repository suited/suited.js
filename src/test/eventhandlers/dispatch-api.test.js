'use strict';


var k = require('../../main/assets/js/konstantes.js');

describe("Dispatch API tests.", function () {

  var e1 = "beginexperimentevent";

  afterEach(function () {
    // runs after each test in this block
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = dispatch.events();
    //lookup handlers for es[0] and assert it has no handlers.
    //    var e0hs = dispatch.listeners(es[0]);
    expect(es).to.be.empty;
  });


  it("A handler can be added to an event", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = dispatch.events();
    console.log("known events are " + JSON.stringify(es));
    expect(es).to.be.empty;
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(e1);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle = dispatch.on(e1, function () {
      console.log("dummy callback 1");
    });
    var e0hs2 = dispatch.listeners(e1);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(1);
    e0hs2[0].listener(); //run it
  });

  it("A handler can be added to non existant event", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = dispatch.events();

    var handle = dispatch.on("nosuchevent", function () {
      console.log("bad callback 2");
    });
    var e0hs = dispatch.listeners("nosuchevent");
    expect(e0hs).not.to.be.empty;
    expect(e0hs).to.have.lengthOf(1);
    e0hs[0].listener(); //run it

  });

  it("An event can have more than one handler and ", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = dispatch.events();
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(e1);
    expect(e0hs).to.be.empty;
    for (var i = 0; i < 4; i++) {
      dispatch.on(e1, function (x) {
        return x;
      });
    }

    var e0hs2 = dispatch.listeners(e1);
    expect(e0hs2).to.have.lengthOf(4);
  });

  it("An event handlers fire in the prescribed order, by default in the order they were added", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = [e1];
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(es[0]);
    expect(e0hs).to.be.empty;
    for (var i = 0; i < 4; i++) {
      dispatch.on(es[0], function (x) {
        return x;
      });
    }

    var e0hs2 = dispatch.listeners(es[0]);
    expect(e0hs2).to.have.lengthOf(4);
    e0hs2.forEach(function (d, i, a) {
      var x = d.listener(i);
      console.log("running callback " + i + " whose id is " + d.id + " where ret = " + x);
      assert.equal(d.id, "" + es[0] + "-" + "listener-" + i);
    });
  });

  it("A handler can be deregistered from an event using the handler id", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = [e1];
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = dispatch.on(es[0], function () {
      console.log("dummy callback 1");
    });
    var handle2 = dispatch.on(es[0], function () {
      console.log("dummy callback 2");
    });
    var handle3 = dispatch.on(es[0], function () {
      console.log("dummy callback 3");
    });
    var e0hs2 = dispatch.listeners(es[0]);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(3);

    //deregister a handler 
    dispatch.off(handle2);

    var e0hs3 = dispatch.listeners(es[0]);
    expect(e0hs3).to.have.lengthOf(2);

    //test that 1 AND 3 ARE STILL VALID
    var h1 = dispatch.getCallback(handle1)
    expect(h1).not.to.be.undefined;
    expect(h1).not.to.be.null;
    var h2 = dispatch.getCallback(handle2)
    expect(h2).to.equal(null);
    expect(h2).not.to.be.undefined;
    expect(h2).to.be.null;

    var h3 = dispatch.getCallback(handle3)
    expect(h3).not.to.be.undefined;
    expect(h3).not.to.be.null;
  });

  it("A handler can be deregistered from an event using the handler id first handler", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = [e1];
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = dispatch.on(es[0], function () {
      console.log("dummy callback 1");
    });
    var handle2 = dispatch.on(es[0], function () {
      console.log("dummy callback 2");
    });
    var handle3 = dispatch.on(es[0], function () {
      console.log("dummy callback 3");
    });
    var e0hs2 = dispatch.listeners(es[0]);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(3);

    //deregister a handler 
    dispatch.off(handle1);

    var e0hs3 = dispatch.listeners(es[0]);
    expect(e0hs3).to.have.lengthOf(2);

    //test that 1 AND 3 ARE STILL VALID
    var h1 = dispatch.getCallback(handle1)
    expect(h1).to.equal(null);
    expect(h1).not.to.be.undefined;
    expect(h1).to.be.null;

    var h2 = dispatch.getCallback(handle2)
    expect(h2).not.to.be.undefined;
    expect(h2).not.to.be.null;

    var h3 = dispatch.getCallback(handle3)
    expect(h3).not.to.be.undefined;
    expect(h3).not.to.be.null;


  });

  it("A handler can be deregistered from an event using the handler id last handler", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = [e1];
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = dispatch.on(es[0], function () {
      console.log("dummy callback 1");
    });
    var handle2 = dispatch.on(es[0], function () {
      console.log("dummy callback 2");
    });
    var handle3 = dispatch.on(es[0], function () {
      console.log("dummy callback 3");
    });
    var e0hs2 = dispatch.listeners(es[0]);
    console.log("e0hs2 is " + JSON.stringify(e0hs2));

    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(3);

    //deregister a handler 
    dispatch.off(handle3);

    var e0hs3 = dispatch.listeners(es[0]);
    expect(e0hs3).to.have.lengthOf(2);

    //test that 1 AND 3 ARE STILL VALID
    var h1 = dispatch.getCallback(handle1)
    expect(h1).not.to.be.undefined;
    expect(h1).not.to.be.null;

    var h2 = dispatch.getCallback(handle2)
    expect(h2).not.to.be.undefined;
    expect(h2).not.to.be.null;

    var h3 = dispatch.getCallback(handle3)
    expect(h3).not.to.be.undefined;
    expect(h3).to.be.null;


  });

  it("A handler can be replaced using the handler id", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = [e1];
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = dispatch.on(es[0], function () {
      console.log("dummy callback 1");
      return "handler1";
    });
    var handle2 = dispatch.on(es[0], function () {
      console.log("dummy callback2");
      return "handler2";
    });
    var handle3 = dispatch.on(es[0], function () {
      console.log("dummy callback3");
      return "handler3";
    });
    console.log("<><><><><>< handle2 =  " + handle1)
    expect(handle2).to.equals('beginexperimentevent-listener-1')

    var e0hs2 = dispatch.listeners(es[0]);
    expect(e0hs2).not.to.be.empty;
    expect(e0hs2).to.have.lengthOf(3);

    var cb2 = dispatch.getCallback(handle2);
    expect(cb2).not.to.be.null;
    expect(cb2).not.to.be.undefined;
    //    console.log("<><><><><><><>< " + cb1);
    var ret1 = cb2();
    expect(ret1).to.equals("handler2");

    var handlereplace = dispatch.on(es[0], function () {
      return "replaced2";
    }, handle2);
    expect(handlereplace).to.equals(handle2);

    var repcb2 = dispatch.getCallback(handle2);
    expect(repcb2).not.to.be.null;
    expect(repcb2).not.to.be.undefined;
    //    console.log("<><><><><><><>< " + repcb2);

    var ret2 = repcb2();
    expect(ret2).to.equals("replaced2");


    var e0hs3 = dispatch.listeners(es[0]);
    expect(e0hs3).not.to.be.empty;
    expect(e0hs3).to.have.lengthOf(3);


  });

  it("A handler can be replaced using the handler id", function () {
    var Dispatch = require('../../main/assets/js/dispatch.js');
    var dispatch = new Dispatch();
    var es = [e1];
    console.log("known events are " + JSON.stringify(es));
    //lookup handlers for es[0] and assert it has no handlers.
    var e0hs = dispatch.listeners(es[0]);
    console.log("e0hs are " + JSON.stringify(e0hs));
    console.log("es[0] is " + JSON.stringify(es[0]));
    expect(e0hs).to.be.empty;
    var handle1 = dispatch.on(es[0], function (data) {
      console.log("dummy callback 1");
      return "handler1" + data.foo;
    });
    var handle2 = dispatch.on(es[0], function (data) {
      console.log("dummy callback2");
      return "handler2" + data.foo;
    });
    var handle3 = dispatch.on(es[0], function (data) {
      console.log("dummy callback3");
      return "handler3" + data.foo;
    });

    dispatch(es[0], {
      "foo": "bar"
    });

  });

});
