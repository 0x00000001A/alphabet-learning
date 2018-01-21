/* @flow */
var ObjectAlphabet = require('./types/object-alphabet');
var ObjectAlphabetLetter = require('./types/object-alphabet-letter');

var AlphabetLetter = require('./alphabet-letter');
var AlphabetLetterGroup = require('./alphabet-letter-group');

var Alphabet = (function() {
  /**
   * Alphabet class
   * Stores a groups of letters
   * Stores an instance of pronouncing service
   * Accepts an object as an argument with given structure:
   * @example
   * ```js
   * {
   *   name: "Japan",
   *   code: "ja",
   *   groups: [
   *     [{
   *       letter: 'す',
   *       description: 'su'
   *     }, {
   *       letter: 'さ',
   *       description: 'sa',
   *       sentence: 'Hello, world!'
   *     }]
   *    ]
   *  }
   * ```
   * @param { ObjectAlphabet } alphabet Correct alphabet object
   */
  function Alphabet(alphabet: ObjectAlphabet) {
    this._groups = [];
    this._groupsCount = 0;
    this._languageName = '';
    this._languageCode = '';

    this._initGroups(alphabet.groups);
  }

  Alphabet.prototype = {
    constructor: Alphabet,

    /**
     * Returns amount of groups stored in alphabet
     * @returns { number }
     */
    size: function(): number {
      return this._groupsCount;
    },

    /**
     * Returns group with given ID
     * @param { number } groupId ID of group
     * @returns { AlphabetLetterGroup | undefined }
     */
    getGroup: function(groupId: number): AlphabetLetterGroup | void {
      return this._groups[groupId];
    },

    /**
     * Creates and stores new group with given ID and letters
     * @private
     * @param { number } groupId Group ID
     * @param { Array<ObjectAlphabetLetter> } letter Letters to put in created group
     */
    _addGroup: function(groupId: number, letters: Array<ObjectAlphabetLetter>) {
      this._groups[groupId] = new AlphabetLetterGroup(groupId, letters);
      this._groupsCount++;
    },

    /**
     * Creates and stores instances of AlphabetLetterGroup
     * @private
     * @param { Array<Array<ObjectAlphabetLetter>> } groups List of letter groups
     */
    _initGroups: function(groups: Array<Array<ObjectAlphabetLetter>>) {
      var groupsCount = groups.length;

      for (var i = 0; i < groupsCount; i++) {
        this._addGroup(i, groups[i]);
      }
    }
  };

  return Alphabet;
})();

module.exports = Alphabet;
