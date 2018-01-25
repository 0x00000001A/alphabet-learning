/* @flow */
import type { ObjectAlphabetLetter } from './types/object-alphabet-letter';

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
   * @param { number } id ID, what will be given to group
   * @param { Array<ObjectAlphabetLetter> } letters Array of letters should be stored in group
   */
  function AlphabetLetterGroup(
    id: number,
    letters: Array<ObjectAlphabetLetter>
  ) {
    this._id = id;
    this._letters = [];
    this._lettersCount = 0;

    this._initLetters(letters);
  }

  AlphabetLetterGroup.prototype = {
    constructor: AlphabetLetterGroup,

    /**
     * Get amount of letters stored in group
     * @returns { number } Amoun of letters stored in group
     */
    size: function(): number {
      return this._lettersCount;
    },

    /**
     * Get group id
     * @returns { number } Group id
     */
    getId: function(): number {
      return this._id;
    },

    /**
     * Get letter what stores given id
     * @param { number } id Letter id
     * @returns { AlphabetLetter }
     */
    getLetter: function(id: number): AlphabetLetter {
      return this._letters[id];
    },

    /**
     * Creates instance of AlphabetLetter with passed in data
     * @private
     * @param { number } id ID for letter. Will be passed to AlphabetLetter
     * @param { object } letter Letter data
     */
    _addLetter: function(id: number, letter: ObjectAlphabetLetter) {
      this._letters[id] = new AlphabetLetter(id, letter);
      this._lettersCount++;
    },

    /**
     * Creates instances of AlphabetLetter for each letter passed in
     * @private
     */
    _initLetters: function(letters: Array<ObjectAlphabetLetter>) {
      var lettersCount = letters.length;
      for (var i = 0; i < lettersCount; i++) {
        this._addLetter(i, letters[i]);
      }
    }
  };

  return AlphabetLetterGroup;
})();

module.exports = AlphabetLetterGroup;
