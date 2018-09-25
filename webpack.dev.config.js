/*jshint esversion: 6 */

const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  output: {
    path: __dirname + '/.dist',
    filename: "bundle.js"
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js", ".css", ".less"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: { /* Loader options go here */
          failOnHint: false
        }
      },
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" },

      { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },

      { test: /\.less$/, loaders: ['style-loader', 'css-loader', 'less-loader'] }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['.dist']),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, ".dist"),
    compress: true,
    port: 9000
  }
};