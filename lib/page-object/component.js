var elementUtils = require('../utils/element-utils'),
    util         = require('util');

var Component = function (props) {
  return Object.create(this, props);
};

Component.prototype = Object.create({}, {
  element: { value: function (selector, type) {
    return elementUtils.findElement(util.format("%s %s", this.rootNode, selector), type);
  } },
  elements: { value: function (selector, type) {
    return elementUtils.findElements(util.format("%s %s", this.rootNode, selector), type);
  } },
  select: { value: function (selector, type) {
    return elementUtils.findSelect(util.format("%s %s", this.rootNode, selector), type);
  } },
  waitFor: { value: function (fn, timeout) { return elementUtils.waitFor(fn, timeout); } }
});

exports = module.exports = Component;
