'use strict';

var modePlugin = require('../../../main/assets/js/plugins/modes/modePlugin.js');
var Mode = require('../../../main/assets/js/plugins/modes/mode.js');

describe("Test mode plugin", function () {
  
  it("Can add a mode", function() {
    
    var theMode = new Mode("testMode");
    
    var modeCount = modePlugin.modeNames.length;
    modePlugin.addMode(theMode);
    
    expect(modePlugin.modeNames.length).to.equal(modeCount + 1);
    expect(modePlugin.modeNames[modeCount]).to.equal("testMode");
    expect(modePlugin.modes["testMode"]).to.equal(theMode);
    
  });
  
  
  it("Can remove a mode", function() {
    
    var theMode = new Mode("removeMode");
    var modeCount = modePlugin.modeNames.length;

    modePlugin.addMode(theMode);
    expect(modePlugin.modeNames.length).to.equal(modeCount + 1);
    expect(modePlugin.modeNames[modeCount]).to.equal("removeMode");
    expect(modePlugin.modes["removeMode"]).to.equal(theMode);

    modePlugin.removeMode("removeMode");
    expect(modePlugin.modeNames.length).to.equal(modeCount);
    expect(modePlugin.modes["removeMode"]).to.be.undefined;    
  });  
  
});