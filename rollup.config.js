var path = require('path');
var flow = require('rollup-plugin-flow-no-whitespace')
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglifyjs = require('rollup-plugin-uglify');

export default {
  input: path.join(__dirname, 'src/index.js'),
  output: {
    name: 'AlphabetLearning',
    file: path.join(__dirname, 'dist/index.js'),
    format: 'cjs'
  },
  plugins: [
    flow(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    // uglifyjs()
  ]
};
