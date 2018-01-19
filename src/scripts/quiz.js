var Utils = require('./utils');
var Alphabet = require('./alphabet');

// TODO List
// @TODO: add modes support
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

    // Not implemented yet
    // this.__mode = 0;      // 0 - Select option, 1 - type the answer in input
    // this.__modePrev = 0;  // Previous mode

    this.__view = {};
    this.__alphabets = alphabets;
    this.__difficulty = 1;
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
              this.__chooseOption(e);
              break;
          }
        }.bind(this)
      );
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
          this.__rollQuestion();
          // Not implemented yet
          // this.__rollMode();
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

    __rollQuestion: function() {
      this.__currentGroup = this.__currentDatabase.getGroup(
        Utils.getRandomUpTo(this.__difficulty)
      );

      this.__currentQuestion = this.__currentGroup.getLetter(
        Utils.getRandomUpTo(this.__currentGroup.size())
      );
    },

    // Not implemented yet
    // __rollMode: function () {
    //   if (this.__currentQuestion.getScore() > this.__MIN_SCORE_TO_REMEMBER) {
    //     var nextMode = Utils.getRandomUpTo(2);

    //     if (nextMode !== this.__modePrev) {
    //       this.__mode = nextMode;
    //     }
    //   }
    // },

    __shuffleOptions: function(options) {
      var j, x, i;

      for (i = options.length - 1; i > 0; i--) {
        j = Utils.getRandomUpTo(i + 1);
        x = options[i];
        options[i] = options[j];
        options[j] = x;
      }
    },

    __chooseOption: function(e) {
      var id = Number(
        e.target.getAttribute(this.__ELEMENT_OPTION_DATA_ID_NAME)
      );

      this.__currentOptionElement = e.target;

      if (id === this.__currentQuestion.getId()) {
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
      Utils.addClass(
        this.__currentOptionElement,
        this.__ELEMENT_OPTION_SUCCESS_CLASS
      );
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

    __displayQuestion: function() {
      this.__view.question.innerHTML = this.__currentQuestion.getLetter();
    },

    __displayMessage: function() {
      var message = this.__currentQuestion.getDescription();

      if (this.__answerPossiblyRemembered()) {
        if (this.mode === 1) {
          message = 'Type your answer and press Enter';
        } else {
          message = 'Select one option';
        }
      }

      this.__view.message.innerHTML = message;
    },

    __displaySentence: function() {
      this.__view.sentence.innerHTML =
        this.__currentQuestion.getSentence() || '';
    },

    __displayInput: function() {
      var groupSize = this.__currentGroup.size();
      this.__view.options.innerHTML = '';

      var options = document.createDocumentFragment();
      var input = document.createElement('input');

      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', 'Enter your answer here');

      Utils.addClass(input, 'quiz__input');

      this.__view.options.appendChild(input);
    },

    __displayOptions: function() {
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

        option.innerHTML = letter.getDescription();
        option.classList = this.__ELEMENT_OPTION_CLASS;
        option.href = '#';

        option.setAttribute(this.__ELEMENT_OPTION_DATA_ID_NAME, letter.getId());
        option.addEventListener(
          this.__EVENTS_MOUSEUP_NAME,
          this.__chooseOption.bind(this)
        );

        options.appendChild(option);
      }

      this.__view.options.appendChild(options);
    },

    __pronounceAnswer: function() {
      this.__currentDatabase.pronounceLetter(this.__currentQuestion);
    },

    __answerPossiblyRemembered: function() {
      return this.__currentQuestion.getScore() > this.__MIN_SCORE_TO_REMEMBER;
    },

    __verifyInputData: function(alphabets) {
      if (!Utils.isArray(alphabets) || !alphabets.length) {
        throw new TypeError('Alphabets must be an array and cant be empty');
      }
    }
  };

  return Quiz;
})();

module.exports = Quiz;
