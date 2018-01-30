/* @flow */
import type { ObjectAlphabetLetter } from './object-alphabet-letter.js';

export type ObjectAlphabet = {
  name: string,
  groups: Array<Array<ObjectAlphabetLetter>>
};
