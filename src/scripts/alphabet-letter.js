var Utils = require('./utils');

var AlphabetLetter = (function() {
  /**
   * Alphabet Letter
   * Represents a letter, a part of Alphabet
   * Requires a correct data object to be passed in
   *
   * @example
   * ```js
   * { letter: 'P', description: 'pe', sentence: 'Tip!' }
   * ```
   *
   * @example
   * ```js
   * { letter: 'P', description: 'pe' }
   * ```
   *
   * @param { Number } id ID for current letter
   * @param { Object } data Letter data as Object
   */
  function AlphabetLetter(id, data) {
    this.__verifyInputData(id, data);

    this.__id = id;
    this.__score = 0;
    this.__letter = data.letter;
    this.__sentence = data.sentence;
    this.__description = data.description;
  }

  AlphabetLetter.prototype = {
    constructor: AlphabetLetter,

    /**
     * Get letter id
     * @returns { Number }
     */
    getId: function () {
      return this.__id;
    },

    /**
     * Get letter score
     * @returns { Number }
     */
    getScore: function () {
      return this.__score;
    },

    /**
     * Increases score for letter by 1
     */
    addScore: function () {
      this.__score++;
    },

    /**
     * Reduces score for letter by 1
     */
    reduceScore: function () {
      this.__score--;
    },

    /**
     * Get letter
     * @returns { String } Letter
     */
    getLetter: function () {
      return this.__letter;
    },

    /**
     * Get sentence, if was specified in alphabet,
     * "undefined" otherwise
     * @example Letter "ん" is never used in the beginning
     * @returns { String | undefined } Sentence
     */
    getSentence: function () {
      return this.__sentence;
    },

    /**
     * Get description
     * Letter description - usually romanized version of letter
     * @example Description for letter "や" is "ya"
     * @returns { String } Description
     */
    getDescription: function () {
      return this.__description;
    },

    /**
     * Check, if passed value(s) is correct
     * @private
     * @param { Number } id Letter id
     * @param { Object } data Data to check
     */
    __verifyInputData: function (id, data) {
      if (!Utils.isNumber(id)) {
        throw new TypeError('Letter ID is incorrect');
      }

      if (!Utils.isString(data.letter) || !data.letter.length) {
        throw new Error('"Letter" propery is required and cannot be empty');
      }

      if (!Utils.isString(data.description) || !data.description.length) {
        throw new Error(
          '"Description" property is required and cannot be empty'
        );
      }

      if (Utils.isString(data.sentence) && !data.sentence.length) {
        throw new Error('Sentence cannot be empty if passed in');
      }
    }
  };

  return AlphabetLetter;
})();

module.exports = AlphabetLetter;
