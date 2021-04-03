/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Webpackbar = require('webpackbar');

const { ESBuildMinifyPlugin } = require('esbuild-loader');
const analyzeBundle = process.env.ANALYZE === 'true';

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'jsx',
              target: 'esnext',
            },
          },
        ],
      },
    ].filter(Boolean),
  },
  optimization: {
    usedExports: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'esnext',
      }),
    ],
  },
  externals: ['regenerator-runtime'],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      assert: require.resolve('assert'),
      url: false,
    },
    alias: {
      async: 'async-es',
      'regenerator-runtime': require.resolve('regenerator-runtime'),
    },
  },
  devtool: false,
  plugins: [
    new Webpackbar({}),
    // BIP39 includes ~240KB of non-english json that we don't currently use.
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/,
    }),
    // new BundleAnalyzerPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      fetch: 'cross-fetch',
    }),
  ],
  output: {
    filename: 'stacks-bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'stacks',
    libraryTarget: 'var',
  },
};
