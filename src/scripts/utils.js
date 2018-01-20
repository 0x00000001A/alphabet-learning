var Utils = (function() {
  /**
   * Helper functions
   */
  function Utils() {}

  /**
   * Adds the given class to the given html element
   * @param { HTMLElement } elem HTML Element for class adding
   * @param { String } str Class name
   */
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

  /**
   * Check, if the provided HTML Element has the given class
   * @param { HTMLElement } elem HTML Element to check for class
   * @param { String } str Class name
   * @returns { Boolean }
   */
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

  /**
   * Remove the given class from the given HTML Element
   * @param { HTMLElement } elem HTML Element to remove the class
   * @param { String } str Class name
   */
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

  /**
   * Check, if the given value is a string
   * @param { * } value Value to check
   * @returns { Boolean }
   */
  Utils.isString = function(value) {
    return this.isTypeOf(value, 'string');
  };

  /**
   * Check, if the given value is a number
   * @param { * } value Value to check
   * @returns { Boolean }
   */
  Utils.isNumber = function(value) {
    return this.isTypeOf(value, 'number');
  };

  /**
   * Check, if the given value is an array
   * @param { * } value Value to check
   * @returns { Boolean }
   */
  Utils.isArray = function(value) {
    return this.isInstanceOf(value, Array);
  };

  /**
   * Check, if the given value have the provided type
   * @param { * } value Value to check
   * @param { String } type Type
   * @returns { Boolean }
   */
  Utils.isTypeOf = function(value, type) {
    return String(typeof value).toLowerCase() === String(type).toLowerCase();
  };

  /**
   * Check, if the provided is instance of the given class
   * @param { * } value Value to check
   * @param { * } instanceExample Instance
   * @returns { Boolean }
   */
  Utils.isInstanceOf = function(value, instanceExample) {
    return value instanceof instanceExample;
  };

  /**
   * Get a random number from 0 up to (but not including) given value
   * @param { Number } value Maximum value
   * @returns { Number }
   */
  Utils.getRandomUpTo = function(value) {
    if (!this.isNumber(value)) {
      throw new Error('Value should be a number');
    }

    return Math.floor(Math.random() * value);
  };

  /**
   * Check, if all of the array elements is instances of provided class
   * @param { Array } arr Array to check
   * @param { * } instanceExample Class
   * @returns { Boolean }
   */
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

  /**
   * Shuffle array items. Modifies passed in array
   * @param { Array } arr Array to shuffle
   */
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
