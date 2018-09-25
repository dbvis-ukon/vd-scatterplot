/*jshint esversion: 6 */

const packageJSON = require('./package.json');
const packageName = normalizePackageName(packageJSON.name);

const LIB_NAME = pascalCase(packageName);
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    publicApi: './src/public_api.ts',
    styles: './src/styles.less'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: LIB_NAME,
    // libraryExport:  LIB_NAME,
    // will name the AMD module of the UMD build. Otherwise an anonymous define is used.
    umdNamedDefine: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
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
      {
        test: /\.tsx?$/, 
        loader: "ts-loader", 
        options: {
          compilerOptions: {
            // this doesn't work right now: https://github.com/Microsoft/TypeScript/issues/21443
            // declaration: false,
            // declarationDir: null
          }
        } 
      },

      { test: /\.css$/, loaders: [MiniCssExtractPlugin.loader, 'css-loader'] },

      { test: /\.less$/, loaders: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};

function camelCaseToDash(myStr) {
  return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function dashToCamelCase(myStr) {
  return myStr.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

function toUpperCase(myStr) {
  return `${myStr.charAt(0).toUpperCase()}${myStr.substr(1)}`;
}

function pascalCase(myStr) {
  return toUpperCase(dashToCamelCase(myStr));
}

function normalizePackageName(rawPackageName) {
  const scopeEnd = rawPackageName.indexOf('/') + 1;

  return rawPackageName.substring(scopeEnd);
}