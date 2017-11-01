const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const jsRule = {
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['env'],
    },
  },
};

const lib = {
  entry: './src/duck-timer.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'duck-timer.js',
    library: 'DuckTimer',
    libraryTarget: 'window',
  },
  module: {
    rules: [jsRule],
  },
  devtool: 'source-map',
};

const min = {
  entry: './src/duck-timer.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'duck-timer.min.js',
    library: 'DuckTimer',
    libraryTarget: 'window',
  },
  module: {
    rules: [jsRule],
  },
  plugins: [new UglifyJsPlugin()],
};

const mod = {
  entry: './src/duck-timer.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'duck-timer.mod.js',
    library: 'DuckTimer',
    libraryTarget: 'umd',
  },
  module: {
    rules: [jsRule],
  },
};

module.exports = [lib, min, mod];
