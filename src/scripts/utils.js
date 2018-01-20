var Utils = (function() {
  function Utils() {}

  Utils.addClass = function(elem, str) {
    if (!this.isString(str) || !str.length) {
      throw new Error('Class name should be non-empty string');
    }

    if (!elem.className.length) {
      elem.className = str;
    } else {
      if (!this.hasClass(elem, str)) {
        elem.className = elem.className.replace(str, '') + ' ' + str;
      }
    }
  };

  Utils.hasClass = function(elem, str) {
    if (!this.isString(str) || !str.length) {
      throw new Error('Class name should be non-empty string');
    }

    return (
      elem.className.indexOf(' ' + str) > -1 ||
      elem.className.indexOf(str + ' ') > -1 ||
      elem.className === str
    );
  };

  Utils.removeClass = function(elem, str) {
    if (!this.isString(str) || !str.length) {
      throw new Error('Class name should be non-empty string');
    }

    if (this.hasClass(elem, str)) {
      elem.className = elem.className
        .replace(' ' + str, '')
        .replace(str + ' ', '')
        .replace(str, '');
    }
  };

  Utils.isString = function(value) {
    return this.isTypeOf(value, 'string');
  };

  Utils.isNumber = function(value) {
    return this.isTypeOf(value, 'number');
  };

  Utils.isArray = function(value) {
    return this.isInstanceOf(value, Array);
  };

  Utils.isTypeOf = function(value, type) {
    return String(typeof value).toLowerCase() === String(type).toLowerCase();
  };

  Utils.isInstanceOf = function(value, instanceExample) {
    return value instanceof instanceExample;
  };

  Utils.getRandomUpTo = function(value) {
    if (!this.isNumber(value)) {
      throw new Error('Value should be a number');
    }

    return Math.floor(Math.random() * value);
  };

  Utils.arrayItemsAreInstancesOf = function(arr, instanceExample) {
    if (!this.isArray(arr)) {
      throw new Error('Is not an array');
    }

    var result = true;
    var arrayLength = arr.length;

    for (var i = 0; i < arrayLength; i++) {
      if (!(arr[i] instanceof instanceExample)) {
        return false;
      }
    }

    return result;
  };

  Utils.shuffleArray = function(arr) {
    var j, x, i;

    for (i = arr.length - 1; i > 0; i--) {
      j = Utils.getRandomUpTo(i + 1);
      x = arr[i];
      arr[i] = arr[j];
      arr[j] = x;
    }
  };

  return Utils;
})();

module.exports = Utils;
