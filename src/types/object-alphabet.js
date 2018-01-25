/* @flow */
import type { ObjectAlphabetLetter } from './object-alphabet-letter.js';

export type ObjectAlphabet = {
  name: string,
  code: string,
  api: string,
  groups: Array<ObjectAlphabetLetter>
};
