var path = require('path');
var merge = require('webpack-merge');
var baseConfig = require('./config/webpack.base.config');

var availableConfigs = {
  'default': 'config/webpack.dev.config.js',
  'prod': 'config/webpack.prod.config.js',
  'dev': 'config/webpack.dev.config.js'
};

var config = require(
  path.join(
    __dirname,
    availableConfigs[process.env.NODE_ENV] || availableConfigs.default
  )
);

module.exports = merge(
  baseConfig,
  config
);
