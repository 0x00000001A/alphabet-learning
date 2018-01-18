var Utils = require('./utils');
var AlphabetLetter = require('./alphabet-letter');

var AlphabetPronouncing = (function() {
  /**
   * Provides TTS functionality
   * Asks API by given URI for mp3 file what will be played, if its possible
   * Requires API uri, what should contain "%s" and "%l" placeholders, what
   * will be replaced with text (letter) for pronounce and language code
   * @example
   * ```js
   * // API Uri
   * new AlphabetPronouncing('http//tts.com/speech?text=%s&lang=%l', 'ja')
   * ```
   * @param { String } languageCode Language code
   * @param { String } apiUri Api uri
   */
  function AlphabetPronouncing (languageCode, apiUri) {
    this.__verifyInputData(languageCode);

    this.__cache = [];
    this.__apiUri = apiUri;
    this.__languageCode = languageCode;
    this.__auidoEnabled = !!apiUri && this.__isBrowserCanPlayAudio();
  }

  AlphabetPronouncing.prototype = {
    constructor: AlphabetPronouncing,

    /**
     * Pronounce given letter
     * @param { AlphabetLetter } letter Letter to be pronounced
     */
    pronounce: function (letter) {
      if (!this.__auidoEnabled) {
        return;
      }

      var cached = this.__getFromCache(letter);

      if (cached) {
        cached.play();
      } else {
        this.__addToCache(letter, function (audio) {
          audio.play();
        });
      }
    },

    /**
     * Caches audio, calls callback function when audio can be played
     * @private
     * @param { AlphabetLetter } letter Letter
     * @param { Void } cb Callback function
     */
    __addToCache: function(letter, cb) {
      var cached = this.__cache[this.__getCacheKey(letter)] = new Audio(
        this.__buildApiUri()
      );

      cached.oncanplay = function () {
        cb(cached);
      }.bind(this);
    },

    /**
     * Returns audio from cache
     * @private
     * @param { AlphabetLetter } Letter
     * @returns { AudioNode } Cached Audio
     */
    __getFromCache: function (letter) {
      return this.__cache[this.__getCacheKey(letter)];
    },

    /**
     * Build cache key for current letter
     * @private
     * @param { AlphabetLetter } Letter
     * @returns { String } Cache key
     */
    __getCacheKey: function (letter) {
      return letter.getId() + letter.getLetter() + letter.getDescription();
    },

    /**
     * Build URI for request
     * Replaces "%s" with letter and "%l" with language code
     * @private
     * @returns { Strign } API Uri with replaced placeholders
     */
    __buildApiUri: function () {
      return this.__apiUri
        .replace('%s', letter.getLetter())
        .replace('%l', this.__languageCode);
    },

    /**
     * Check, if browser can play audio or not
     * @private
     * @returns { Boolean }
     */
    __isBrowserCanPlayAudio: function () {
      try {
        new Audio();
        return true;
      } catch (e) {
        /* istanbul ignore next */
        return false;
      }
    },

    /**
     * Check, if passed value(s) is correct
     * @private
     * @param { String } code Language code
     * @param { String } api TTS Api uri
     */
    __verifyInputData: function (code, api) {
      if (!Utils.isString(code) || !code.length) {
        throw new TypeError(
          'Language code must be a string and cannot be empty'
        );
      }

      if (Utils.isString(api) && !api.length) {
        throw new Error('Api uri must be fullfilled if passed in');
      }
    }
  };

  return AlphabetPronouncing;
})();

module.exports = AlphabetPronouncing;
