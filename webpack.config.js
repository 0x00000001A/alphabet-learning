var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    }, {
      test: /\.(png|jpg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 514
        }
      }
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: false,
        removeComments: true,
        removeEmptyAttributes: true,
      }
    }),
    new ExtractTextPlugin('styles.css'),
    new CleanWebpackPlugin([ 'dist/*' ], { root: __dirname }),
    new StyleExtHtmlWebpackPlugin({
      filename: 'styles.css',
      minify: true
    })
  ]
};
