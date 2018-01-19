var Utils = require('./utils');
var AlphabetLetter = require('./alphabet-letter');
var AlphabetPronounce = require('./alphabet-pronouncing');
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
   * @param { Object } alphabet Correct alphabet object
   */
  function Alphabet(alphabet) {
    this.__verifyInputData(alphabet);

    this.__groups = [];
    this.__groupsCount = 0;
    this.__languageName = '';
    this.__languageCode = '';
    this.__alphabetPronounce = new AlphabetPronounce(
      alphabet.code,
      alphabet.api
    );

    this.__initGroups(alphabet.groups);
  }

  Alphabet.prototype = {
    constructor: Alphabet,

    /**
     * Returns amount of groups stored in alphabet
     * @returns { Number }
     */
    size: function() {
      return this.__groupsCount;
    },

    /**
     * Returns group with given ID
     * @param { Number } groupId ID of group
     * @returns { AlphabetLetterGroup | undefined }
     */
    getGroup: function(groupId) {
      if (!Utils.isNumber(groupId)) {
        throw new TypeError('Group ID must be a string');
      }

      return this.__groups[groupId];
    },

    /**
     * Asks AlphabetPronounce to pronounce a given letter
     * @param { AlphabetLetter } AlphabetLetter Letter to pronounce
     */
    pronounceLetter: function(alphabetLetter) {
      this.__alphabetPronounce.pronounce(alphabetLetter);
    },

    /**
     * Creates and stores new group with given ID and letters
     * @private
     * @param { Number } groupId Group ID
     * @param { Array } letter Letters to put in created group
     */
    __addGroup: function(groupId, letters) {
      this.__groups[groupId] = new AlphabetLetterGroup(groupId, letters);
      this.__groupsCount++;
    },

    /**
     * Creates and stores instances of AlphabetLetterGroup
     * @private
     * @param { Array } groups List of letter groups
     */
    __initGroups: function(groups) {
      var groupsCount = groups.length;

      for (var i = 0; i < groupsCount; i++) {
        this.__addGroup(i, groups[i]);
      }
    },

    /**
     * Check, if passed value(s) is correct
     * @private
     * @param { * } data Data to check
     */
    __verifyInputData: function(data) {
      if (!Utils.isString(data.name) || !data.name.length) {
        throw new Error('Name is required');
      }

      if (!Utils.isArray(data.groups) || !data.groups.length) {
        throw new Error('Groups property is required');
      }
    }
  };

  return Alphabet;
})();

module.exports = Alphabet;
