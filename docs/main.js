/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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

  return Utils;
})();

module.exports = Utils;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(0);

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
    getId: function() {
      return this.__id;
    },

    /**
     * Get letter score
     * @returns { Number }
     */
    getScore: function() {
      return this.__score;
    },

    /**
     * Increases score for letter by 1
     */
    addScore: function() {
      this.__score++;
    },

    /**
     * Reduces score for letter by 1
     */
    reduceScore: function() {
      this.__score--;
    },

    /**
     * Get letter
     * @returns { String } Letter
     */
    getLetter: function() {
      return this.__letter;
    },

    /**
     * Get sentence, if was specified in alphabet,
     * "undefined" otherwise
     * @example Letter "ん" is never used in the beginning
     * @returns { String | undefined } Sentence
     */
    getSentence: function() {
      return this.__sentence;
    },

    /**
     * Get description
     * Letter description - usually romanized version of letter
     * @example Description for letter "や" is "ya"
     * @returns { String } Description
     */
    getDescription: function() {
      return this.__description;
    },

    /**
     * Check, if passed value(s) is correct
     * @private
     * @param { Number } id Letter id
     * @param { Object } data Data to check
     */
    __verifyInputData: function(id, data) {
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);

var Hiragana = __webpack_require__(4);
var Katakana = __webpack_require__(5);

var Quiz = __webpack_require__(6);

var quiz = new Quiz([
  Hiragana,
  Katakana,
]);

quiz.start();


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {"name":"Japan","code":"ja","api":"https://translate.google.ru/translate_tts?ie=UTF-8&q=%s&tl=%l&total=1&idx=0&textlen=1&client=tw-ob&ttsspeed=0.24","groups":[[{"letter":"あ","description":"a"},{"letter":"い","description":"i"},{"letter":"う","description":"u"},{"letter":"え","description":"e"},{"letter":"お","description":"o"}],[{"letter":"か","description":"ka"},{"letter":"き","description":"ki"},{"letter":"く","description":"ku"},{"letter":"け","description":"ke"},{"letter":"こ","description":"ko"}],[{"letter":"さ","description":"sa"},{"letter":"し","description":"shi"},{"letter":"す","description":"su"},{"letter":"せ","description":"se"},{"letter":"そ","description":"so"}],[{"letter":"た","description":"ta"},{"letter":"ち","description":"chi"},{"letter":"つ","description":"tsu"},{"letter":"て","description":"te"},{"letter":"と","description":"to"}],[{"letter":"は","description":"ha"},{"letter":"ひ","description":"hi"},{"letter":"ふ","description":"fu"},{"letter":"へ","description":"he"},{"letter":"ほ","description":"ho"}],[{"letter":"ら","description":"ra"},{"letter":"り","description":"ri"},{"letter":"る","description":"ru"},{"letter":"れ","description":"re"},{"letter":"ろ","description":"ro"}],[{"letter":"や","description":"ya"},{"letter":"ゆ","description":"yu"},{"letter":"よ","description":"yo"}],[{"letter":"わ","description":"wa"},{"letter":"を","description":"wo"},{"letter":"ん","description":"n"}]]}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = {"name":"Japan","code":"ja","api":"https://translate.google.ru/translate_tts?ie=UTF-8&q=%s&tl=%l&total=1&idx=0&textlen=1&client=tw-ob&ttsspeed=0.24","groups":[[{"letter":"ア","description":"a"},{"letter":"イ","description":"i"},{"letter":"ウ","description":"u"},{"letter":"エ","description":"e"},{"letter":"オ","description":"o"}],[{"letter":"カ","description":"ka"},{"letter":"キ","description":"ki"},{"letter":"ク","description":"ku"},{"letter":"ケ","description":"ke"},{"letter":"コ","description":"ko"}],[{"letter":"サ","description":"sa"},{"letter":"シ","description":"shi"},{"letter":"ス","description":"su"},{"letter":"セ","description":"se"},{"letter":"ソ","description":"so"}],[{"letter":"タ","description":"ta"},{"letter":"チ","description":"chi"},{"letter":"ツ","description":"tsu"},{"letter":"テ","description":"te"},{"letter":"ト","description":"to"}],[{"letter":"ナ","description":"na"},{"letter":"ニ","description":"ni"},{"letter":"ヌ","description":"nu"},{"letter":"ネ","description":"ne"},{"letter":"ノ","description":"no"}],[{"letter":"ハ","description":"ha"},{"letter":"ヒ","description":"hi"},{"letter":"フ","description":"fu"},{"letter":"ヘ","description":"he"},{"letter":"ホ","description":"ho"}],[{"letter":"マ","description":"ma"},{"letter":"ミ","description":"mi"},{"letter":"ム","description":"mu"},{"letter":"メ","description":"me"},{"letter":"モ","description":"mo"}],[{"letter":"ヤ","description":"ya"},{"letter":"ユ","description":"yu"},{"letter":"ヨ","description":"yo"}],[{"letter":"ラ","description":"ra"},{"letter":"リ","description":"ri"},{"letter":"ル","description":"ru"},{"letter":"レ","description":"re"},{"letter":"ロ","description":"ro"}],[{"letter":"ワ","description":"wa"},{"letter":"ヲ","description":"wo"},{"letter":"ン","description":"n"}],[{"letter":"ガ","description":"ga"},{"letter":"ギ","description":"gi"},{"letter":"グ","description":"gu"},{"letter":"ゲ","description":"ge"},{"letter":"ゴ","description":"go"}],[{"letter":"ザ","description":"za"},{"letter":"ジ","description":"ji"},{"letter":"ズ","description":"zu"},{"letter":"ゼ","description":"ze"},{"letter":"ゾ","description":"zo"}],[{"letter":"ダ","description":"da"},{"letter":"ヂ","description":"ji"},{"letter":"ヅ","description":"zu"},{"letter":"デ","description":"de"},{"letter":"ド","description":"do"}],[{"letter":"バ","description":"ba"},{"letter":"ビ","description":"bi"},{"letter":"ブ","description":"bu"},{"letter":"ベ","description":"be"},{"letter":"ボ","description":"bo"}],[{"letter":"パ","description":"pa"},{"letter":"ピ","description":"pi"},{"letter":"プ","description":"pu"},{"letter":"ぺ","description":"pe"},{"letter":"ポ","description":"po"}]]}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(0);
var Alphabet = __webpack_require__(7);

// TODO List
// @TODO: refactor required
// @TODO: jsdoc
// @TODO: pronouncing is not working for some reason
// @TODO: fix double clicking on option issue
// @TODO: divide description to latin and transcription
// @TODO: add font param to alphabet for downloading language specified fonts
// @TODO: add interface for alphabet selecton
// @TODO: save progress somewhere and allow to reset this progress
// @TODO: show progress in progress-bar
// @TODO: take back unit-tests
// @TODO: complete Hiragana, Katakana alphabets
// @TODO: native app
// @TODO: handle events only on added options and inputs

var Quiz = (function() {
  /**
   * Quiz class
   * Provides functionality for alphabet learning (Quiz)
   * Requires correct alpabets list to be passed in
   *
   * @example
   * ```js
   * new Quiz([{
   *  name: "Japan",
   *  code: "ja",
   *  groups: [
   *    [
   *      { letter: "x", description: "descx" }
   *    ],
   *    [
   *      { letter: "y", description: "descy", sentence: "tip" },
   *      { letter: "z", description: "descz" }
   *    ]
   *  ]
   * }])
   * ```
   * @param { Array } alphabets Array of alphabets will be used in Quiz
   */
  function Quiz(alphabets) {
    this.__verifyInputData(alphabets);

    this.__view = {};
    this.__modes = 2;
    this.__alphabets = alphabets;
    this.__difficulty = 1;
    this.__currentMode = 0;
    this.__currentGroup = [];
    this.__currentQuestion = null;
    this.__currentDatabase = null;
    this.__currentOptionElement = null;
    this.__currentOptionElementIndex = -1;

    this.__ANIMATIONS_DELAY = 400;
    this.__MIN_SCORE_TO_REMEMBER = 1;

    // Element classes
    this.__ELEMENT_QUESTION_SUCCESS_CLASS = 'quiz__question_shake';
    this.__ELEMENT_QUESTION_FAILURE_CLASS = 'quiz__question_shake';
    this.__ELEMENT_OPTION_SUCCESS_CLASS = 'quiz__option_right';
    this.__ELEMENT_OPTION_FAILURE_CLASS = 'quiz__option_wrong';
    this.__ELEMENT_OPTION_CLASS = 'quiz__option';

    // Element id's
    this.__ELEMENT_QUIZ_CONTAINER = 'quiz';
    this.__ELEMENT_QUESTION_ID = 'quiz__question';
    this.__ELEMENT_SENTENCE_ID = 'quiz__sentence';
    this.__ELEMENT_OPTIONS_ID = 'quiz__options';
    this.__ELEMENT_MESSAGE_ID = 'quiz__message';

    // Attribute names
    this.__ELEMENT_OPTION_DATA_ID_NAME = 'data-id';

    // Event names
    this.__EVENTS_MOUSEUP_NAME = 'mouseup';
    this.__EVENTS_KEYDOWN_NAME = 'keydown';

    // Key codes
    this.__KEY_CODE_UP = 38;
    this.__KEY_CODE_DOWN = 40;
    this.__KEY_CODE_LEFT = 37;
    this.__KEY_CODE_RIGHT = 39;
    this.__KEY_CODE_ENTER = 13;
    this.__KEY_CODE_SPACE = 32;
  }

  Quiz.prototype = {
    constructor: Quiz,

    start: function() {
      this.__initQuestions();
      this.__initKeyboard();
      this.__initView();
      this.__next();
    },

    __initQuestions: function() {
      this.__currentDatabase = new Alphabet(this.__alphabets[0]);
    },

    __initKeyboard: function() {
      document.addEventListener(
        this.__EVENTS_KEYDOWN_NAME,
        function(e) {
          switch (e.keyCode) {
            case this.__KEY_CODE_LEFT:
            case this.__KEY_CODE_DOWN:
              this.__focusPreviousOption();
              break;
            case this.__KEY_CODE_UP:
            case this.__KEY_CODE_RIGHT:
              this.__focusNextOption();
              break;
            case this.__KEY_CODE_SPACE:
            case this.__KEY_CODE_ENTER:
              this.__answer(e);
              break;
          }
        }.bind(this)
      );
    },

    __initView: function() {
      this.__view.container = document.getElementById(
        this.__ELEMENT_QUIZ_CONTAINER
      );

      this.__view.sentence = document.getElementById(
        this.__ELEMENT_SENTENCE_ID
      );

      this.__view.question = document.getElementById(
        this.__ELEMENT_QUESTION_ID
      );

      this.__view.options = document.getElementById(this.__ELEMENT_OPTIONS_ID);
      this.__view.message = document.getElementById(this.__ELEMENT_MESSAGE_ID);

      setTimeout(
        function() {
          Utils.removeClass(this.__view.container, 'quiz__loading');
        }.bind(this),
        this.__ANIMATIONS_DELAY
      );
    },

    __next: function() {
      setTimeout(
        function() {
          this.__changeGroup();
          this.__changeQuestion();
          this.__changeMode();

          this.__displayMessage();
          this.__displaySentence();
          this.__displayQuestion();
          this.__displayOptions();

          this.__focusOptionWithCurrentIndex();
          this.__pronounceAnswer();
        }.bind(this),
        this.__ANIMATIONS_DELAY
      );
    },

    __changeMode: function () {
      if (this.__currentQuestion && this.__answerPossiblyRemembered()) {
        this.__currentMode = Utils.getRandomUpTo(this.__modes + 1);
      } else {
        this.__currentMode = 0;
      }
    },

    __changeGroup: function () {
      this.__currentGroup = this.__currentDatabase.getGroup(
        Utils.getRandomUpTo(this.__difficulty)
      );
    },

    __changeQuestion: function() {
      this.__currentQuestion = this.__currentGroup.getLetter(
        Utils.getRandomUpTo(this.__currentGroup.size())
      );
    },

    __displayMessage: function() {
      var message;

      if (!this.__answerPossiblyRemembered()) {
        switch (this.__currentMode) {
          case 0:
            message = this.__currentQuestion.getDescription();
            break
          case 1:
            message = this.__currentQuestion.getLetter();
            break;
        }
      } else {
        switch (this.__currentMode) {
          case 0:
          case 1:
            message = 'Select one option';
            break;
          case 2:
            message = 'Type your answer and press Enter';
            break;
          default:
            // unknown mode;
        }
      }

      this.__view.message.innerHTML = message;
    },

    __displayQuestion: function () {
      var question;

      switch (this.__currentMode) {
        case 0:
        case 2:
          question = this.__currentQuestion.getLetter();
          break;
        case 1:
          question = this.__currentQuestion.getDescription();
          break;
        default:
          // unknown mode;
      }

      this.__view.question.innerHTML = question;
    },

    __displaySentence: function() {
      this.__view.sentence.innerHTML =
        this.__currentQuestion.getSentence() || '';
    },

    __displayOptions: function () {
      var options;

      switch (this.__currentMode) {
        case 0:
        case 1:
          options = this.__generateOptions();
          break;
        case 2:
          options = this.__generateInput();
          break;
        default:
          // unknown mode
          break;
      }

      this.__view.options.innerHTML = '';
      this.__view.options.appendChild(options);
    },

    __generateOptions: function() {
      var groupSize = this.__currentGroup.size();
      this.__view.options.innerHTML = '';

      var options = document.createDocumentFragment();
      var letters = [];

      for (var i = 0; i < groupSize; i++) {
        letters.push(this.__currentGroup.getLetter(i));
      }

      this.__shuffleOptions(letters);

      for (var i = 0; i < groupSize; i++) {
        var option = document.createElement('a');
        var letter = letters[i];

        if (this.__currentMode === 0) {
          option.innerHTML = letter.getDescription();
        } else {
          option.innerHTML = letter.getLetter();
        }

        option.classList = this.__ELEMENT_OPTION_CLASS;
        option.href = '#';

        option.setAttribute(this.__ELEMENT_OPTION_DATA_ID_NAME, letter.getId());
        option.addEventListener(
          this.__EVENTS_MOUSEUP_NAME,
          this.__answer.bind(this)
        );

        options.appendChild(option);
      }

      return options;
    },

    __generateInput: function() {
      var groupSize = this.__currentGroup.size();
      this.__view.options.innerHTML = '';

      var options = document.createDocumentFragment();
      var input = document.createElement('input');

      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', 'Enter your answer here');

      Utils.addClass(input, 'quiz__input');

      return input;
    },

    __focusNextOption: function() {
      if (this.__currentOptionElementIndex < this.__currentGroup.size() - 1) {
        this.__currentOptionElementIndex++;
      } else {
        this.__currentOptionElementIndex = 0;
      }

      this.__focusOptionWithCurrentIndex();
    },

    __focusPreviousOption: function() {
      if (this.__currentOptionElementIndex > 0) {
        this.__currentOptionElementIndex--;
      } else {
        this.__currentOptionElementIndex = this.__currentGroup.size() - 1;
      }

      this.__focusOptionWithCurrentIndex();
    },

    __focusOptionWithCurrentIndex: function() {
      var el = this.__view.options.childNodes[this.__currentOptionElementIndex];
      if (!el) {
        this.__currentOptionElementIndex = 0;
      }
      this.__view.options.childNodes[this.__currentOptionElementIndex].focus();
    },

    __shuffleOptions: function(options) {
      var j, x, i;

      for (i = options.length - 1; i > 0; i--) {
        j = Utils.getRandomUpTo(i + 1);
        x = options[i];
        options[i] = options[j];
        options[j] = x;
      }
    },

    __answer: function(e) {
      var correct = this.__answerIsCorrect(e.target);
      this.__currentOptionElement = e.target;

      if (correct) {
        this.__currentQuestion.addScore();
        this.__increaseDifficultyIfNeeded();
        this.__showWhatAnswerIsCorrect();
        this.__next();
      } else {
        this.__currentQuestion.reduceScore();
        this.__showWhatAnswerIsWrong();
        this.__pronounceAnswer();
      }
    },

    __increaseDifficultyIfNeeded: function() {
      var group = this.__currentDatabase.getGroup(this.__difficulty - 1);
      var groupSize = group.size();

      for (var i = 0; i < groupSize; i++) {
        if (group.getLetter(i).getScore() < this.__MIN_SCORE_TO_REMEMBER) {
          return;
        }
      }

      this.__difficulty++;
    },

    __showWhatAnswerIsCorrect: function() {
      if (this.__currentMode !== 2) {
        Utils.addClass(
          this.__currentOptionElement,
          this.__ELEMENT_OPTION_SUCCESS_CLASS
        );
      }
    },

    __showWhatAnswerIsWrong: function() {
      Utils.addClass(
        this.__currentOptionElement,
        this.__ELEMENT_OPTION_FAILURE_CLASS
      );
      Utils.addClass(
        this.__view.question,
        this.__ELEMENT_QUESTION_FAILURE_CLASS
      );

      setTimeout(
        function() {
          Utils.removeClass(
            this.__currentOptionElement,
            this.__ELEMENT_OPTION_FAILURE_CLASS
          );
          Utils.removeClass(
            this.__view.question,
            this.__ELEMENT_QUESTION_FAILURE_CLASS
          );
        }.bind(this),
        this.__ANIMATIONS_DELAY
      );
    },

    __answerIsCorrect: function (el) {
      switch (this.__currentMode) {
        case 0:
        case 1:
          return this.__currentQuestion.getId() ===
            Number(el.getAttribute(this.__ELEMENT_OPTION_DATA_ID_NAME));
          break;
        case 2:
          return this.__currentQuestion.getDescription().toLowerCase() ===
            el.value.toLowerCase();
        default:
          // unknown mode;
          break;
      }

      return false;
    },

    /**
     * Ask AlphabetPronouncing to try to pronounce current letter
     */
    __pronounceAnswer: function() {
      this.__currentDatabase.pronounceLetter(this.__currentQuestion);
    },

    /**
     * Check, if answer for current question is possibly remembered.
     * Result based on comparing of letter score with __MIN_SCORE_TO_REMEMBER
     * @returns { Boolean }
     */
    __answerPossiblyRemembered: function() {
      return this.__currentQuestion.getScore() > this.__MIN_SCORE_TO_REMEMBER;
    },

    /**
     * Check, if passed value(s) is correct
     * @private
     * @param { Array } alphabets Arrays of alphabets data
     */
    __verifyInputData: function(alphabets) {
      if (!Utils.isArray(alphabets) || !alphabets.length) {
        throw new TypeError('Alphabets must be an array and cant be empty');
      }
    }
  };

  return Quiz;
})();

module.exports = Quiz;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(0);
var AlphabetLetter = __webpack_require__(1);
var AlphabetPronounce = __webpack_require__(8);
var AlphabetLetterGroup = __webpack_require__(9);

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
    this.__alphabetPronounce = new AlphabetPronounce(alphabet.code);

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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(0);
var AlphabetLetter = __webpack_require__(1);

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
  function AlphabetPronouncing(languageCode, apiUri) {
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
    pronounce: function(letter) {
      if (!this.__auidoEnabled) {
        return;
      }

      var cached = this.__getFromCache(letter);

      if (cached) {
        cached.play();
      } else {
        this.__addToCache(letter, function(audio) {
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
      var cached = (this.__cache[this.__getCacheKey(letter)] = new Audio(
        this.__buildApiUri()
      ));

      cached.oncanplay = function() {
        cb(cached);
      }.bind(this);
    },

    /**
     * Returns audio from cache
     * @private
     * @param { AlphabetLetter } Letter
     * @returns { AudioNode } Cached Audio
     */
    __getFromCache: function(letter) {
      return this.__cache[this.__getCacheKey(letter)];
    },

    /**
     * Build cache key for current letter
     * @private
     * @param { AlphabetLetter } Letter
     * @returns { String } Cache key
     */
    __getCacheKey: function(letter) {
      return letter.getId() + letter.getLetter() + letter.getDescription();
    },

    /**
     * Build URI for request
     * Replaces "%s" with letter and "%l" with language code
     * @private
     * @returns { Strign } API Uri with replaced placeholders
     */
    __buildApiUri: function() {
      return this.__apiUri
        .replace('%s', letter.getLetter())
        .replace('%l', this.__languageCode);
    },

    /**
     * Check, if browser can play audio or not
     * @private
     * @returns { Boolean }
     */
    __isBrowserCanPlayAudio: function() {
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
    __verifyInputData: function(code, api) {
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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var Utils = __webpack_require__(0);
var AlphabetLetter = __webpack_require__(1);

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
    size: function() {
      return this.__lettersCount;
    },

    /**
     * Get group id
     * @returns { Number } Group id
     */
    getId: function() {
      return this.__id;
    },

    /**
     * Get letter what stores given id
     * @param { Number } id Letter id
     * @returns { AlphabetLetter }
     */
    getLetter: function(id) {
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
    __initLetters: function(letters) {
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
    __verifyInputData: function(id, letters) {
      if (!Utils.isNumber(id)) {
        throw new TypeError('Group ID must be a number');
      }

      if (!Utils.isArray(letters) || !letters.length) {
        throw new TypeError('Letters must be an array and cannot be empty');
      }
    }
  };

  return AlphabetLetterGroup;
})();

module.exports = AlphabetLetterGroup;


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map