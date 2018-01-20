var Utils = require('./utils');
var Alphabet = require('./alphabet');
var PriorityQueue = require('./priority-queue');

// TODO List
// @TODO: store pronouncation mp3 files somewhere and only if they are not exists - try to use api
// @TODO: refactor required
// @TODO: add font param to alphabet for downloading language specified fonts
// @TODO: add interface for alphabet selecton
// @TODO: save progress somewhere and allow to reset this progress
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
    this.__alphabet = null;
    this.__alphabets = alphabets;
    this.__difficulty = 1;
    this.__inputIsBlocked = false;

    this.__currentMode = 0;
    this.__currentGroup = null;
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

    /**
     * Initiate quiz and take first question
     */
    start: function() {
      this.__initQuestions();
      this.__initKeyboard();
      this.__initView();
      this.__next();
    },

    /**
     * Init question list
     * Creates new instance of alphabet and initiates current database
     * @private
     */
    __initQuestions: function() {
      this.__alphabet = new Alphabet(this.__alphabets[0]);
      this.__currentDatabase = new PriorityQueue(this.__alphabet.size());
      this.__currentDatabase.setComparator(function(groupA, groupB) {
        var aScore = 0;
        var bScore = 0;
        var aSize = groupA.size();
        var bSize = groupB.size();
        var size = Math.min(aSize, bSize);

        for (var i = 0; i < size; i++) {
          aScore += groupA.getLetter(i).getScore();
          bScore += groupB.getLetter(i).getScore();
        }

        return aScore < bScore;
      });

      this.__currentDatabase.push(this.__alphabet.getGroup(0));
    },

    /**
     * Initiates keyboard helpers, such as keyboard navigation and answering
     * using keyboard
     * @private
     */
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

    /**
     * Search for required elements and store them in quiz
     * @private
     */
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

    /**
     * Take next question
     * @private
     */
    __next: function() {
      setTimeout(
        function() {
          this.__inputIsBlocked = false;

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

    /**
     * Changes current mode to random one
     * If previous mode was `2`, then `0` will be used, or random mode otherwise
     * @private
     */
    __changeMode: function() {
      if (this.__currentQuestion && this.__answerPossiblyRemembered()) {
        if (this.__currentMode === 2) {
          this.__currentMode = 0;
        } else {
          this.__currentMode = Utils.getRandomUpTo(this.__modes + 1);
        }
      } else {
        this.__currentMode = 0;
      }
    },

    /**
     * Change current questions group
     * Takes random one from two groups from database with lowest score
     * and saves to `__currentGroup`
     * @private
     */
    __changeGroup: function() {
      // Save modifications for current group if exists
      if (this.__currentGroup) {
        this.__currentDatabase.push(this.__currentGroup);
      }

      // Get last X groups with lowest score
      var lowestScoreGroup;
      var groups = [];
      var x = 2;

      for (var i = 0; i < x; i++) {
        var groupWithLowestScore = this.__currentDatabase.shift();

        if (groupWithLowestScore) {
          groups.push(groupWithLowestScore);
        }

        if (!lowestScoreGroup) {
          lowestScoreGroup = groupWithLowestScore;
        }
      }

      // Shuffle groups array and use first one group from result as a
      // current group
      Utils.shuffleArray(groups);
      this.__currentGroup = groups.shift();

      // Put back in queue remaining groups
      var restGroupsSize = groups.length;

      for (var i = 0; i < restGroupsSize; i++) {
        this.__currentDatabase.push(groups[i]);
      }

      // We would to increase difficulty if group with lowest score have
      // score `>= __MIN_SCORE_TO_REMEMBER`
      this.__increaseDifficultyIfNeeded(lowestScoreGroup);
    },

    /**
     * Change current question
     * Takes one random letter from `__currentGroup` and saves to
     * `__currentQuestion`
     * @private
     */
    __changeQuestion: function() {
      this.__currentQuestion = this.__currentGroup.getLetter(
        Utils.getRandomUpTo(this.__currentGroup.size())
      );
    },

    /**
     * Update progress bar
     * @private
     */
    __displayProgress: function() {
      this.__view.progress.style.width = this.__getProgress() + '%';
    },

    /**
     * Show message (instruction or letter, depends on score)
     * @private
     */
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

    /**
     * Show question (letter or description, depends on score)
     * @private
     */
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

    /**
     * Display question sentence
     * @private
     */
    __displaySentence: function() {
      this.__view.sentence.innerHTML = this.__currentQuestion.getSentence();
    },

    /**
     * Display options - input or options, depends on current mode
     * @private
     */
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

    /**
     * Returns percent value of learning progress
     * It takes each letter in each group and compares with
     * `__MIN_SCORE_TO_REMEMBER`
     * @private
     * @returns { Number }
     */
    __getProgress: function() {
      return 0;
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

    /**
     * Build a HTML elements what would be used as answer options
     * @private
     * @returns { HTMLElement } Container with options inside
     */
    __generateOptions: function() {
      var groupSize = this.__currentGroup.size();
      this.__view.options.innerHTML = '';

      var options = document.createDocumentFragment();
      var letters = [];

      for (var i = 0; i < groupSize; i++) {
        letters.push(this.__currentGroup.getLetter(i));
      }

      Utils.shuffleArray(letters);

      for (var i = 0; i < groupSize; i++) {
        var option = document.createElement('a');
        var letter = letters[i];
        var html = '';

        html += '<span class="quiz__option__text">';
        if (this.__currentMode === 0) {
          html += letter.getDescription();

          if (letter.getTranscription().length) {
            html += '<br/>[' + letter.getTranscription() + ']';
          }
        } else {
          html += letter.getLetter();
        }
        html += '</span>';

        option.innerHTML = html;

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

    /**
     * Build a HTML input what would be used as answer option
     * User have to type answer there
     * @private
     * @returns { HTMLElement } Container with input inside
     */
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

    /**
     * Asks element with `__currentOptionElementIndex + 1` to take the focus
     * @private
     */
    __focusNextOption: function() {
      if (this.__currentOptionElementIndex < this.__currentGroup.size() - 1) {
        this.__currentOptionElementIndex++;
      } else {
        this.__currentOptionElementIndex = 0;
      }

      this.__focusOptionWithCurrentIndex();
    },

    /**
     * Asks element with `__currentOptionElementIndex - 1` to take the focus
     * @private
     */
    __focusPreviousOption: function() {
      if (this.__currentOptionElementIndex > 0) {
        this.__currentOptionElementIndex--;
      } else {
        this.__currentOptionElementIndex = this.__currentGroup.size() - 1;
      }

      this.__focusOptionWithCurrentIndex();
    },

    /**
     * Asks element with `__currentOptionElementIndex` to take the focus
     * @private
     */
    __focusOptionWithCurrentIndex: function() {
      var el = this.__view.options.childNodes[this.__currentOptionElementIndex];

      if (!el) {
        this.__currentOptionElementIndex = 0;
      }

      this.__view.options.childNodes[this.__currentOptionElementIndex].focus();
    },

    /**
     * Make an answer
     * If answer is correct, next question will be shown
     * @private
     * @param { HTMLElement } e Element what contains an answer
     */
    __answer: function(e) {
      // Prevent multiple clicks
      if (this.__inputIsBlocked) {
        return;
      }

      // Check, if `e.target` is correct
      var correct = this.__answerIsCorrect(e.target);
      this.__currentOptionElement =
        e.target.tagName.toLowerCase() === 'span'
          ? e.target.parentElement
          : e.target;

      // Check, is answer is correct
      if (correct) {
        this.__inputIsBlocked = true;
        this.__currentQuestion.addScore();
        this.__showWhatAnswerIsCorrect();
        this.__pronounceAnswer(true);
        this.__next();
      } else {
        this.__currentQuestion.reduceScore();
        this.__showWhatAnswerIsWrong();
        this.__pronounceAnswer(true);
      }
    },

    /**
     * If score of group with lowest score is high enough (depends on
     * `__MIN_SCORE_TO_REMEMBER` value), next group will be added to the
     * `__currentDatabase`
     * @private
     * @param { AlphabetLetterGroup } groupWithLowestScore Letter group
     */
    __increaseDifficultyIfNeeded: function(groupWithLowestScore) {
      var groupSize = groupWithLowestScore.size();

      for (var i = 0; i < groupSize; i++) {
        if (
          groupWithLowestScore.getLetter(i).getScore() <
          this.__MIN_SCORE_TO_REMEMBER
        ) {
          return;
        }
      }

      this.__currentDatabase.push(
        this.__alphabet.getGroup(this.__currentDatabase.size())
      );
    },

    /**
     * Animate elements according to incorrect answer
     * @private
     */
    __showWhatAnswerIsCorrect: function() {
      if (this.__currentMode !== 2) {
        Utils.addClass(
          this.__currentOptionElement,
          this.__ELEMENT_OPTION_SUCCESS_CLASS
        );
      }
    },

    /**
     * Animate elements according to incorrect answer
     * @private
     */
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

    /**
     * Check, if answer is correct
     * Actually, take an element as an argument and checks his content or
     * attributes
     * @private
     * @param { HTMLElement } el HTML Element with answer
     * @returns { Boolean }
     */
    __answerIsCorrect: function(el) {
      var element = el.tagName.toLowerCase() === 'span' ? el.parentElement : el;

      switch (this.__currentMode) {
        case 0:
        case 1:
          return (
            this.__currentQuestion.getId() ===
            Number(element.getAttribute(this.__ELEMENT_OPTION_DATA_ID_NAME))
          );
          break;
        case 2:
          return (
            this.__currentQuestion.getDescription().toLowerCase() ===
            element.value.toLowerCase()
          );
        default:
          // unknown mode;
          break;
      }

      return false;
    },

    /**
     * Ask AlphabetPronouncing to try to pronounce current letter
     * @private
     */
    __pronounceAnswer: function(doNotLookAtScore) {
      if (
        doNotLookAtScore ||
        this.__currentQuestion.getScore() <= this.__MIN_SCORE_TO_REMEMBER
      ) {
        this.__alphabet.pronounceLetter(this.__currentQuestion);
      }
    },

    /**
     * Check, if answer for current question is possibly remembered.
     * Result based on comparing of letter score with __MIN_SCORE_TO_REMEMBER
     * @private
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
