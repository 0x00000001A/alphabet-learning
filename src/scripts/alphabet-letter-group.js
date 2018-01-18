var Utils = require('./utils');
var AlphabetLetter = require('./alphabet-letter');

var AlphabetLetterGroup = (function() {
  /**
   * Alphabet letter group class
   * Takes in and stores array of letters as instances of AlphabetLetter
   * Requires correct array of letters to be passed in
   * @example
   * ```js
   * [
   *   { letter: 'P', description: 'pe' },
   *   { letter: 'P', description: 'pe', sentence: 'tip' }
   *   // ...
   * ]
   * ```
   * @param { Number } id ID, what will be given to group
   * @param { Array } letters Array of letters should be stored in group
   */
  function AlphabetLetterGroup(id, letters) {
    this.__verifyInputData(id, letters);

    this.__id = id;
    this.__letters = [];
    this.__lettersCount = 0;

    this.__initLetters(letters);
  }

  AlphabetLetterGroup.prototype = {
    constructor: AlphabetLetterGroup,

    /**
     * Get amount of letters stored in group
     * @returns { Number } Amoun of letters stored in group
     */
    size: function () {
      return this.__lettersCount;
    },

    /**
     * Get group id
     * @returns { Number } Group id
     */
    getId: function () {
      return this.__id;
    },

    /**
     * Get letter what stores given id
     * @param { Number } id Letter id
     * @returns { AlphabetLetter }
     */
    getLetter: function (id) {
      if (!Utils.isNumber(id)) {
        throw new TypeError('Group ID must be a number');
      }

      return this.__letters[id];
    },

    /**
     * Creates instance of AlphabetLetter with passed in data
     * @private
     * @param { Number } id ID for letter. Will be passed to AlphabetLetter
     * @param { Object } letter Letter data
     */
    __addLetter: function(id, letter) {
      this.__letters[id] = new AlphabetLetter(id, letter);
      this.__lettersCount++;
    },

    /**
     * Creates instances of AlphabetLetter for each letter passed in
     * @private
     */
    __initLetters: function (letters) {
      var lettersCount = letters.length;
      for (var i = 0; i < lettersCount; i++) {
        this.__addLetter(i, letters[i]);
      }
    },

    /**
     * Check, if passed value(s) is correct
     * @private
     * @param { Number } id Letter id
     * @param { Object } letters Array of letters
     */
    __verifyInputData: function (id, letters) {
      if (!Utils.isNumber(id)) {
        throw new TypeError('Group ID must be a number');
      }

      if (!Utils.isArray(letters) || !letters.length) {
        throw new TypeError('Letters must be an array and cannot be empty');
      }
    }
  }

  return AlphabetLetterGroup;
})();

module.exports = AlphabetLetterGroup;
