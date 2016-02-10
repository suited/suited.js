'use strict';

var State = require('../../main/assets/js/state.js');
var Nav = require('../../main/assets/js/nav.js');
var k = require('../../main/assets/js/konstantes.js');

describe("Tests to confirm that state navigation works correctly in different modes.", function () {


  //Stub magic pos function just taks array of bools to fake it.
  function magicPos(arrBools) {
    arrBools = Array.prototype.slice.call(arrBools);

    function foo(pos, mode) {
      if (pos >= arrBools.length) return undefined;
      else {
        return arrBools[pos];
      }
    };
    return foo;
  }

  it("can't initialise state so that minimum slide is less than slide-0", function () {
    var minus10State = new State(-10, "fony"); // fony mode should revert to default... should probably test that in a State test
    var currentId = minus10State.previous();
    expect(currentId).toEqual("slide-0");
  });


  it("Nav can't find previous Num < 0 for all modes", function () {
    var modes = k.modes;
    var nav = new Nav(modes, magicPos([true]));

    //search for previoous num from zero assert zero for each mode
    for (var i = 0; i < modes.length; i++) {
      var prevMode0 = nav.calcPrevNum(0, modes[i]);
      expect(prevMode0).toEqual(0);
    }
  });

  it("Nav says that previous Num to 1 === 0 for all modes", function () {
    var modes = k.modes;
    var nav = new Nav(modes, magicPos([true]));

    //search for previoous num from zero assert zero for each mode
    for (var i = 0; i < modes.length; i++) {
      var prevMode0 = nav.calcPrevNum(1, modes[i]);
      expect(prevMode0).toEqual(0);
    }
  });

  it("Nav says that next Num to 0 === value defined by nextPos Func for that mode", function () {
    var modes = k.modes;
    var nav = new Nav(modes, magicPos([true, true]));

    //search for previoous num from zero assert zero for each mode
    for (var i = 0; i < modes.length; i++) {
      var nextMode0 = nav.calcNextNum(0, modes[i]);
      console.log("NEXT:- mode = " + modes[i] + " next=" + nextMode0);
      expect(nextMode0).toEqual(1);
    }
  });

  //    it("decrementing always ends at slide-0 and goes no further.", function () {
  //        val deckSize = 10;
  //        val badDeclSize = 20;
  //        expect(true).toBe(true);
  //    });


  /* it('should redirect index.html to index.html#/phones', function() {
       browser.get('/index.html');
       browser.getLocationAbsUrl().then(function(url) {
           expect(url.split('#')[1]).toBe('/main');
         });
     });*/
});
