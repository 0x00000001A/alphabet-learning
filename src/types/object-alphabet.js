/* @flow */
var ObjectAlphabetLetter = require('./object-alphabet-letter');

type ObjectAlphabet = {
  name: string,
  code: string,
  api: string,
  groups: Array<ObjectAlphabetLetter>
};

module.exports = ObjectAlphabet;
