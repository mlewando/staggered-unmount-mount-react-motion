const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sourcePath = path.join(__dirname, './app');

module.exports = {
  context: sourcePath,
  entry: {
    index: path.resolve(__dirname, 'app', 'index')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: 'http://localhost:10080/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath
    ]
  },
  module: {
    rules: [
      { test: /\.js(x?)$/, exclude: /node_modules/, loaders: ['babel-loader']}
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html')
    })
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
}
