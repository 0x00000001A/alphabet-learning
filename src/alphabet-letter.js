/* @flow */
var ObjectAlphabetLetter = require('./types/object-alphabet-letter');

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
   * @param { number } id ID for current letter
   * @param { ObjectAlphabetLetter } data Letter data as Object
   */
  function AlphabetLetter(id: number, data: ObjectAlphabetLetter) {
    this._id = id;
    this._score = 0;
    this._letter = data.letter;
    this._sentence = data.sentence || '';
    this._description = data.description;
    this._transcription = data.transcription || '';
  }

  AlphabetLetter.prototype = {
    constructor: AlphabetLetter,

    /**
     * Get letter id
     * @returns { number }
     */
    getId: function(): number {
      return this._id;
    },

    /**
     * Get letter score
     * @returns { number }
     */
    getScore: function(): number {
      return this._score;
    },

    /**
     * Increases score for letter by 1
     */
    addScore: function() {
      this._score++;
    },

    /**
     * Reduces score for letter by 1
     */
    reduceScore: function() {
      this._score--;
    },

    /**
     * Get letter
     * @returns { string } Letter
     */
    getLetter: function(): string {
      return this._letter;
    },

    /**
     * Get sentence, if was specified in alphabet,
     * "undefined" otherwise
     * @example Letter "ん" is never used in the beginning
     * @returns { string | undefined } Sentence
     */
    getSentence: function(): string | void {
      return this._sentence;
    },

    /**
     * Get description
     * Letter description - usually romanized version of letter
     * @example Description for letter "や" is "ya"
     * @returns { string } Description
     */
    getDescription: function(): string {
      return this._description;
    },

    /**
     * Get transcription
     * @returns { string } Transcription
     */
    getTranscription: function(): string {
      return this._transcription;
    }
  };

  return AlphabetLetter;
})();

module.exports = AlphabetLetter;
