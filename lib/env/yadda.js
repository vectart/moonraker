var session = require('moonraker').session,
    config  = require('moonraker').config,
    Yadda   = require('yadda'),
    glob    = require('glob'),
    chai    = require('chai'),
    path    = require('path'),
    fs      = require('fs');

require('coffee-script/register');
Yadda.plugins.mocha.StepLevelPlugin.init();
chai.should();

features(session.queue, function (feature) {

  scenarios(feature.scenarios, function (scenario) {

    steps(scenario.steps, function (step, done) {
      if (step === scenario.steps[0]) session.reset();
      session.execute(function () {
        new Yadda.Yadda(loadStepDefs()).yadda(step);
      }).then(done);
    });

  });
});

function loadStepDefs() {
  var dictionary = new Yadda.Dictionary();
  var library = new Yadda.localisation.English.library(dictionary);

  glob.sync(config.stepsDir + "/**/*").forEach(function (file) {
    var steps = require('../../../../' + file);
    try {
      steps.define(library);
    } catch (e) {
      if (e instanceof TypeError) {
        console.warn("*** File: "+ file + " contained no step definitions\n");
      }
    }
  });
  return library;
}

before(function (done) {
  session.create();
  done();
});

afterEach(function () {
  if (this.currentTest.state !== 'passed') {
    session.saveScreenshot(this.currentTest.title);
  }
});

after(function (done) {
  session.getDriver().quit().then(done);
});
