/* @flow */
import type { ObjectAlphabet } from './types/object-alphabet';
import type { ObjectAlphabetLetter } from './types/object-alphabet-letter';

var Utils = require('./utils');
var Alphabet = require('./alphabet');
var PriorityQueue = require('./priority-queue');
var AlphabetLetterGroup = require('./alphabet-letter-group');

var Quiz = (function() {
  /**
   * Main alphabet library class (Quiz)
   * Provides functionality for alphabet learning
   */
  function Quiz() {
    /**
     * @var { number } _modes
     * 0 - Letter as question and descriptions as options
     * 1 - Description as question and letters as options
     * 2 - Letter as question and no options (free-type answer)
     */
    this._modes = 2;
    this._alphabet = null;

    this._currentMode = 0;
    this._currentGroup = null;
    this._currentQuestion = null;
    this._currentDatabase = null;

    this._MIN_SCORE_TO_REMEMBER = 4;
    this._MIN_SCORE_TO_ACCEPT_PROGRESS = 6;
  }

  Quiz.prototype = {
    constructor: Quiz,

    getSnapshot: function() {
      // return all of the quiz information including alphabet
      return {
        mode: this._currentMode,
        group: this._currentGroup.getId(),
        alphabet: this._alphabet.toObject(),
        question: this._currentQuestion.getId(),
        database: this._currentDatabase.size(),
        minScoreToRemember: this._MIN_SCORE_TO_REMEMBER,
        minScoreToAcceptProgress: this._MIN_SCORE_TO_ACCEPT_PROGRESS
      };
    },

    useSnapshot: function(snapshot) {
      // It adds group with id = 0 initially
      this._initQuestions(snapshot.alphabet)

      // But we have to add remaining groups manually
      for (var i = 1; i < snapshot.database; i++) {
        this._currentDatabase.push(this._alphabet.getGroup(i));
      }

      this._currentMode = snapshot.mode;
      this._currentGroup = this._alphabet.getGroup(snapshot.group);
      this._currentQuestion = this._currentGroup.getLetter(snapshot.question);
      this._MIN_SCORE_TO_REMEMBER = snapshot.minScoreToRemember;
      this._MIN_SCORE_TO_ACCEPT_PROGRESS = snapshot.minScoreToAcceptProgress;
    },

    /**
     * Initiate quiz and take first question
     * Requires correct alpabets list to be passed in
     * @example
     * ```js
     * new Quiz([{
     *  name: "Japan",
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
     * @param { ObjectAlphabet } alpabet
     */
    start: function(alphabet: ObjectAlphabet) {
      this._initQuestions(alphabet);
      this.next();
    },

    /**
     * Take next question
     */
    next: function(answerText: string) {
      if (this._currentQuestion) {
        if (this.isCorrect(answerText)) {
          this._currentQuestion.addScore();
        } else {
          this._currentQuestion.reduceScore();
        }
      }

      this._changeGroup();
      this._changeQuestion();
      this._changeMode();
    },

    /**
     * Check, if answer is correct
     * @param { string } answerText
     * @returns { boolean }
     */
    isCorrect: function(answerText: string): boolean {
      var letter = this._currentQuestion.getLetter().toLowerCase();
      var description = this._currentQuestion.getDescription().toLowerCase();
      var answer = answerText.toLowerCase();

      return letter === answer || description === answer;
    },

    /**
     * Get an array of options
     * Result depends on current mode
     * For mode = 0 or mode = 1 array with objects will be returned
     * For mode = 2 empty array will be returned
     * @example
     * ```js
     * // mode = 0
     * [ { text: 'option text', additional: 'additional option text' }, ]
     * // mode = 1
     * [ { text: 'option text' }, ]
     * // mode = 2
     * []
     * ```
     * @returns { Array<{ text: string, additional?: string }> } Array of options
     */
    getOptions: function(): Array<{ text: string, additional?: string }> {
      var options = [];

      // If current mode is 'letter-and-options' or 'description-and-options'
      if (this._currentMode === 0 || this._currentMode === 1) {
        var groupSize = this._currentGroup.size();

        for (var i = 0; i < groupSize; i++) {
          var letter = this._currentGroup.getLetter(i);
          var option = {};

          if (this._currentMode === 0) {
            option.text = letter.getDescription();
            option.additional = letter.getTranscription();
          } else {
            option.text = letter.getLetter();
          }

          options.push(option);
        }
      }

      Utils.shuffleArray(options);

      return options;
    },

    /**
     * Get message
     * @returns { string } Message text
     */
    getMessage: function(): string {
      var message = '';

      if (!this._answerPossiblyRemembered()) {
        switch (this._currentMode) {
          case 0:
            message = this._currentQuestion.getDescription();
            break;
          case 1:
            message = this._currentQuestion.getLetter();
            break;
        }
      } else {
        switch (this._currentMode) {
          case 0: // Letter as question with options
          case 1: // Description as question with options
            message = 'Select one option';
            break;
          case 2: // Letter as question with free-type answer
            message = 'Type your answer and press Enter';
            break;
          default:
          // unknown mode;
        }
      }

      return message;
    },

    /**
     * Get sentence
     * @returns { string } Sentence text
     */
    getSentence: function(): string {
      return this._currentQuestion.getSentence();
    },

    /**
     * Get question
     * @returns { string } Question text
     */
    getQuestion: function(): { text: string, original: ObjectAlphabetLetter } {
      var question = {
        text: '',
        original: this._currentQuestion.toObject()
      };

      switch (this._currentMode) {
        case 0: // Letter with options
        case 2: // Letter and free-type answer
          question.text = this._currentQuestion.getLetter();
          break;
        case 1: // Description with options
          question.text = this._currentQuestion.getDescription();
          break;
        default:
        // unknown mode;
      }

      return question;
    },

    /**
     * Returns percent value of learning progress
     * @returns { number }
     */
    getProgress: function(): number {
      var total = 0;
      var progress = 0;
      var databaseSize = this._currentDatabase.size();

      for (var id = 0; id < databaseSize; id++) {
        var group = this._alphabet.getGroup(id);
        var groupSize = group.size();

        for (var ig = 0; ig < groupSize; ig++) {
          if (
            group.getLetter(ig).getScore() > this._MIN_SCORE_TO_ACCEPT_PROGRESS
          ) {
            progress++;
          }

          total++;
        }
      }

      var percentage = progress / total * 100;

      return isNaN(percentage) ? 0 : percentage;
    },

    /**
     * How many times user have to give a right answer before new
     * letters will be added to quiz
     * @param { number } val
     */
    setMinScoreToRememember: function(val: number) {
      if (val > 0) {
        this._MIN_SCORE_TO_REMEMBER = val;
      }
    },

    /**
     * Init question list
     * Creates new instance of alphabet and initiates current database
     * @param { ObjectAlphabet } alpabet
     * @private
     */
    _initQuestions: function(alpabet: ObjectAlphabet) {
      this._alphabet = new Alphabet(alpabet);
      this._currentDatabase = new PriorityQueue(this._alphabet.size());
      this._currentDatabase.setComparator(function(
        groupA: AlphabetLetterGroup,
        groupB: AlphabetLetterGroup
      ): boolean {
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

      this._currentDatabase.push(this._alphabet.getGroup(0));
    },

    /**
     * Changes current mode to random one
     * If previous mode was `2`, then `0` will be used, or random mode otherwise
     * @private
     */
    _changeMode: function() {
      if (this._currentQuestion && this._answerPossiblyRemembered()) {
        if (this._currentMode === 2) {
          this._currentMode = 0;
        } else {
          this._currentMode = Utils.getRandomUpTo(this._modes + 1);
        }
      } else {
        this._currentMode = 0;
      }
    },

    /**
     * Change current questions group
     * Takes random one from two groups from database with lowest score
     * and saves to `_currentGroup`
     * @private
     */
    _changeGroup: function() {
      // Save modifications for current group if exists
      if (this._currentGroup) {
        this._currentDatabase.push(this._currentGroup);
      }

      // Get last X groups with lowest score
      var lowestScoreGroup;
      var groups = [];
      var x = 2;

      for (var i = 0; i < x; i++) {
        var groupWithLowestScore = this._currentDatabase.shift();

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
      this._currentGroup = groups.shift();

      // Put back in queue remaining groups
      var restGroupsSize = groups.length;

      for (var i = 0; i < restGroupsSize; i++) {
        this._currentDatabase.push(groups[i]);
      }

      // We would to increase difficulty if group with lowest score have
      // score `>= _MIN_SCORE_TO_REMEMBER`
      this._increaseDifficultyIfNeeded(lowestScoreGroup);
    },

    /**
     * Change current question
     * Takes one random letter from `_currentGroup` and saves to
     * `_currentQuestion`
     * @private
     */
    _changeQuestion: function() {
      this._currentQuestion = this._currentGroup.getLetter(
        Utils.getRandomUpTo(this._currentGroup.size())
      );
    },

    /**
     * If score of group with lowest score is high enough (depends on
     * `_MIN_SCORE_TO_REMEMBER` value), next group will be added to the
     * `_currentDatabase`
     * @private
     * @param { AlphabetLetterGroup } groupWithLowestScore Letter group
     */
    _increaseDifficultyIfNeeded: function(
      groupWithLowestScore: AlphabetLetterGroup
    ) {
      var groupSize = groupWithLowestScore.size();

      for (var i = 0; i < groupSize; i++) {
        if (
          groupWithLowestScore.getLetter(i).getScore() <
          this._MIN_SCORE_TO_REMEMBER
        ) {
          return;
        }
      }

      this._currentDatabase.push(
        this._alphabet.getGroup(this._currentDatabase.size())
      );
    },

    /**
     * Check, if answer for current question is possibly remembered.
     * Result based on comparing of letter score with _MIN_SCORE_TO_REMEMBER
     * @private
     * @returns { boolean }
     */
    _answerPossiblyRemembered: function(): boolean {
      return this._currentQuestion.getScore() > this._MIN_SCORE_TO_REMEMBER;
    }
  };

  return Quiz;
})();

module.exports = Quiz;
