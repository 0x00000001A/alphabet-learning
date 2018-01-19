var Utils = require('./utils');
var Alphabet = require('./alphabet');

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
    this.__MIN_SCORE_TO_REMEMBER = 4;
    this.__MIN_SCORE_TO_ACCEPT_PROGRESS = 6;

    // Element classes
    this.__ELEMENT_QUESTION_SUCCESS_CLASS = 'quiz__question_shake';
    this.__ELEMENT_QUESTION_FAILURE_CLASS = 'quiz__question_shake';
    this.__ELEMENT_OPTION_SUCCESS_CLASS = 'quiz__option_right';
    this.__ELEMENT_OPTION_FAILURE_CLASS = 'quiz__option_wrong';
    this.__ELEMENT_OPTION_CLASS = 'quiz__option';

    // Element id's
    this.__ELEMENT_QUIZ_CONTAINER = 'quiz';
    this.__ELEMENT_PROGRESS_ID = 'quiz__progress';
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
      this.__view.progress = document.getElementById(
        this.__ELEMENT_PROGRESS_ID
      );

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

          this.__displayProgress();
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

    __changeMode: function() {
      if (this.__currentQuestion && this.__answerPossiblyRemembered()) {
        this.__currentMode = Utils.getRandomUpTo(this.__modes + 1);
      } else {
        this.__currentMode = 0;
      }
    },

    __changeGroup: function() {
      this.__currentGroup = this.__currentDatabase.getGroup(
        Utils.getRandomUpTo(this.__difficulty)
      );
    },

    __changeQuestion: function() {
      this.__currentQuestion = this.__currentGroup.getLetter(
        Utils.getRandomUpTo(this.__currentGroup.size())
      );
    },

    __displayProgress: function() {
      this.__view.progress.style.width = this.__getProgress() + '%';
    },

    __displayMessage: function() {
      var message;

      if (!this.__answerPossiblyRemembered()) {
        switch (this.__currentMode) {
          case 0:
            message = this.__currentQuestion.getDescription();
            break;
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

    __displayQuestion: function() {
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

    __displayOptions: function() {
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

    __getProgress: function() {
      var total = 0;
      var progress = 0;
      var databaseSize = this.__currentDatabase.size();

      for (var id = 0; id < databaseSize; id++) {
        var group = this.__currentDatabase.getGroup(id);
        var groupSize = group.size();

        for (var ig = 0; ig < groupSize; ig++) {
          if (
            group.getLetter(ig).getScore() > this.__MIN_SCORE_TO_ACCEPT_PROGRESS
          ) {
            progress++;
          }

          total++;
        }
      }

      return progress / total * 100;
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
      setTimeout(
        function() {
          var el = this.__view.options.childNodes[
            this.__currentOptionElementIndex
          ];

          if (!el) {
            this.__currentOptionElementIndex = 0;
          }

          this.__view.options.childNodes[
            this.__currentOptionElementIndex
          ].focus();
        }.bind(this),
        100
      );
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

    __answerIsCorrect: function(el) {
      switch (this.__currentMode) {
        case 0:
        case 1:
          return (
            this.__currentQuestion.getId() ===
            Number(el.getAttribute(this.__ELEMENT_OPTION_DATA_ID_NAME))
          );
          break;
        case 2:
          return (
            this.__currentQuestion.getDescription().toLowerCase() ===
            el.value.toLowerCase()
          );
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
