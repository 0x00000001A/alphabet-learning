/* @flow */

var Utils = (function() {
  /**
   * Helper functions
   */
  function Utils() {}

  /**
   * Get a random number from 0 up to (but not including) given value
   * @param { number } value Maximum value
   * @returns { number }
   */
  Utils.getRandomUpTo = function(value: number): number {
    if (!this.isNumber(value)) {
      throw new Error('Value should be a number');
    }

    return Math.floor(Math.random() * value);
  };

  /**
   * Shuffle array items. Modifies passed in array
   * @param { Array<any> } arr Array to shuffle
   */
  Utils.shuffleArray = function(arr: Array<any>) {
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
