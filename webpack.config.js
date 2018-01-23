const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: {
    'duck-timer': './src/duck-timer.ts',
    'duck-timer.min': './src/duck-timer.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'DuckTimer',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'awesome-typescript-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false,
      include: /\.min\.js$/
    }),
    new WebpackNotifierPlugin({
      title: 'Webpack',
      alwaysNotify: true,
      sound: false,
    }),
  ],
  devtool: 'source-map',
};
