var path = require('path');
var flow = require('rollup-plugin-flow-no-whitespace');
var uglifyjs = require('rollup-plugin-uglify');

export default {
  input: path.join(__dirname, 'src/index.js'),
  output: {
    file: path.join(__dirname, 'dist/index.js'),
    format: 'cjs'
  },
  format: 'iife',
  plugins: [
    flow(),
    uglifyjs()
  ]
};
