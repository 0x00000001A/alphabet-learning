var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html'),
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: false,
        removeComments: true,
        removeEmptyAttributes: true,
      }
    })
  ]
};
