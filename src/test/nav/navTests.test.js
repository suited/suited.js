'use strict';

var Nav = require('../../main/assets/js/nav.js');
var k = require('../../main/assets/js/konstantes.js');

describe("Tests to confirm that state navigation works correctly in different modes.", function () {


  //Stub magic pos functions
  function showAll(slideType) {
    return true;
  }
  
  function showSlidesOnly(slideType) {
    return slideType === 'slide';
  }
  
  function showFiguresOnly(slideType) {
    return slideType === 'figure';
  }

  function getNode(slideType) {
    var node = {}
    
    node.hasAttribute = function(attr) {
      return slideType === attr
    }
    
    return node;
  }
  
  function everySecondIsASlide(numSlides) {
    var result = [];
    
    for (var i=0; i < numSlides; i++) {
      var slideType = (i % 2 == 0) ? 'data-slide' : 'data-figure';
      
      result.push(getNode(slideType));
    }
    
    result.item = function(a) {
      return result[a];
    }
    
    return result;
  }
  
  
  it("CalcNext only shows slides of the right type", function() {
    var lastSlideNum = 9
    var nodes = everySecondIsASlide(lastSlideNum + 1);
    var nav = new Nav(showSlidesOnly, nodes);
    
    expect(nav.calcNextNum(0)).to.equal(2);
    expect(nav.calcNextNum(1)).to.equal(2);
    expect(nav.calcNextNum(2)).to.equal(4);
    
    expect(nav.calcNextNum(7)).to.equal(8);
    //Last valid slide is 8
    expect(nav.calcNextNum(8)).to.equal(8);
    
  });

  it("Initialisation fails for no mode position test function", function (){
    var nodes = everySecondIsASlide(10);
    
    var f = function(){new Nav(null, nodes);} 
    expect(f).to.throw("Cannot initialise Navigation without a mode position test function");
  });

  it("Initialisation fails for no navigable nodes", function (){
    var nodes = everySecondIsASlide(10);
    
    var f = function(){new Nav(function(x){return true;},null);} 
    expect(f).to.throw("No navigation is possible. No navigable nodes provided");
  });  
  
  it ("CalcNext works if starting slide number is less than 0", function() {
    var nodes = everySecondIsASlide(10);
    var nav = new Nav(showAll, nodes);
    
    expect(nav.calcNextNum(-10)).to.equal(0);    
  });
  
  it ("CalcNext works if starting slide number is less greater than list length", function() {
    var nodes = everySecondIsASlide(10);
    var nav = new Nav(showAll, nodes);
    
    expect(nav.calcNextNum(100)).to.equal(9);    
  });
  
  it("CalcNext can navigate to the last slide, if it is a valid according to the mode position function", function(){
    var lastSlideNum = 9;
    var nodes = everySecondIsASlide(lastSlideNum + 1);
    
    var nav = new Nav(showFiguresOnly, nodes);
    
    //Going to last slide 
    expect(nav.calcNextNum(lastSlideNum - 1)).to.equal(lastSlideNum);
    
    //Can't go to last slide
    nav = new Nav(showSlidesOnly, nodes);
    expect(nav.calcNextNum(lastSlideNum - 1)).to.equal(lastSlideNum - 1);
  });

  it("Can navigating past last slide will result in last valid slide according to the mode position function", function(){
    var lastSlideNum = 9;
    var nodes = everySecondIsASlide(lastSlideNum + 1);
    
    var nav = new Nav(showSlidesOnly, nodes);
    
    expect(nav.calcNextNum(lastSlideNum + 1)).to.equal(lastSlideNum - 1);
  });
  
  it("CalcPrev only shows slides of the right type", function() {
    var lastSlideNum = 9
    var nodes = everySecondIsASlide(lastSlideNum + 1);
    var nav = new Nav(showSlidesOnly, nodes);
    
    expect(nav.calcPrevNum(0)).to.equal(0);
    expect(nav.calcPrevNum(1)).to.equal(0);
    expect(nav.calcPrevNum(2)).to.equal(0);
    expect(nav.calcPrevNum(3)).to.equal(2);
    expect(nav.calcPrevNum(5)).to.equal(4);
    expect(nav.calcPrevNum(6)).to.equal(4);
    expect(nav.calcPrevNum(lastSlideNum)).to.equal(lastSlideNum - 1);
  });  
  
  it ("CalcPrev works if starting slide number is less than 0", function() {
    var nodes = everySecondIsASlide(10);
    var nav = new Nav(showAll, nodes);
    
    expect(nav.calcPrevNum(-10)).to.equal(0);    
  });
  
  it ("CalcPrev works if starting slide number is less greater than list lenght", function() {
    var nodes = everySecondIsASlide(10);
    var nav = new Nav(showAll, nodes);
    
    expect(nav.calcPrevNum(100)).to.equal(9);    
  });
  
  it("CalcPrev can navigate to the first slide if it is valid according to the mode position function", function(){
    var lastSlideNum = 9;
    var nodes = everySecondIsASlide(lastSlideNum + 1);
    
    var nav = new Nav(showSlidesOnly, nodes);
    
    //Going to last slide 
    expect(nav.calcPrevNum(1)).to.equal(0);
    
    //Can't go to first slide
    nav = new Nav(showFiguresOnly, nodes);
    expect(nav.calcPrevNum(1)).to.equal(1);
  });
  
});