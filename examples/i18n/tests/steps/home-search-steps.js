var homePage = require('../pages/home');
var searchResults = require('../pages/search-results');

exports.define = function (steps) {

  steps.given("la page d'accueil affichée", function () {
    homePage.visit();
  });

  steps.when("je cherche '$query'", function (query) {
    homePage.txtSearch.sendKeys(query);
    homePage.btnSearch.click();
  });

  steps.then("je dois voir '$heading' dans l'en-tête", function (heading) {
    searchResults.heading.getText().then(function (text) {
      text.should.equal(heading);
    });
  });

};
