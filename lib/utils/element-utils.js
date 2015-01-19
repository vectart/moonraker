var session   = require('../env/session'),
    util      = require('util'),
    webdriver = require('selenium-webdriver');

module.exports = {

  findElement: function (value, type) {
    return session.getDriver().findElement(getLocator(value, type));
  },

  findElements: function (value, type) {
    return session.getDriver().findElements(getLocator(value, type));
  },

  findSelect: function (value, type) {
    var self = this;
    var elem = this.findElement(value, type);
    elem.selectOption = function (option) {
      elem.click();
      return elem.findElement(webdriver.By.css(util.format("option[value='%s']",
        option.toString() ))).click();
    };
    return elem;
  },

  waitFor: function (fn, timeout) {
    session.getDriver().wait(fn, timeout);
  },

  alert: function () {
    return session.getDriver().switchTo().alert();
  }
};

function getLocator(value, type) {
  if (!type) return webdriver.By.css(value);
  if(webdriver.By.hasOwnProperty(type)) {
    return webdriver.By[type](value);
  } else {
    throw new Error(util.format("Invalid locator type: '%s' for element: '%s'", type, value));
  }
}
