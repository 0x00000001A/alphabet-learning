require('./index.css');

var Hiragana = require('./alphabets/hiragana.json');
var Katakana = require('./alphabets/katakana.json');

var Quiz = require('./scripts/quiz');

var quiz = new Quiz([
  Katakana,
  Hiragana
]);

quiz.start();
