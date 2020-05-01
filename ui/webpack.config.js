const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist-pages'),
  },
  resolve: {
    alias: {
      '@uprtcl/graphql': path.resolve('./node_modules/@uprtcl/graphql'),
      '@uprtcl/holochain-provider': path.resolve(
        './node_modules/@uprtcl/holochain-provider'
      ),
      '@uprtcl/micro-orchestrator': path.resolve(
        './node_modules/@uprtcl/micro-orchestrator'
      ),
      'graphql-tag': path.resolve('./node_modules/graphql-tag'),
      'holochain-profiles': path.resolve('./node_modules/holochain-profiles'),
      'lit-element': path.resolve('./node_modules/lit-element'),
      'lit-html': path.resolve('./node_modules/lit-html'),
      'wicg-inert': path.resolve('./node_modules/wicg-inert/dist/inert'),
      '@authentic/mwc-circular-progress': path.resolve(
        './node_modules/@authentic/mwc-circular-progress'
      ),
      '@authentic/mwc-notched-outline': path.resolve(
        './node_modules/@authentic/mwc-notched-outline'
      ),
      '@material/mwc-list': path.resolve('./node_modules/@material/mwc-list'),
      '@material/mwc-notched-outline': path.resolve(
        './node_modules/@material/mwc-notched-outline'
      ),
      '@material/mwc-textfield': path.resolve(
        './node_modules/@material/mwc-textfield'
      ),
      '@material/mwc-button': path.resolve(
        './node_modules/@material/mwc-button'
      ),
      '@material/mwc-checkbox': path.resolve(
        './node_modules/@material/mwc-checkbox'
      ),
      '@material/mwc-dialog': path.resolve(
        './node_modules/@material/mwc-dialog'
      ),
      '@material/mwc-floating-label': path.resolve(
        './node_modules/@material/mwc-floating-label'
      ),
      '@material/mwc-formfield': path.resolve(
        './node_modules/@material/mwc-formfield'
      ),
      '@material/mwc-icon': path.resolve('./node_modules/@material/mwc-icon'),
      '@material/mwc-icon-button': path.resolve(
        './node_modules/@material/mwc-icon-button'
      ),
      '@material/mwc-line-ripple': path.resolve(
        './node_modules/@material/mwc-line-ripple'
      ),
      '@material/mwc-linear-progress': path.resolve(
        './node_modules/@material/mwc-linear-progress'
      ),
      '@material/mwc-menu': path.resolve('./node_modules/@material/mwc-menu'),
      '@material/mwc-radio': path.resolve('./node_modules/@material/mwc-radio'),
      '@material/mwc-ripple': path.resolve(
        './node_modules/@material/mwc-ripple'
      ),
      '@material/mwc-select': path.resolve(
        './node_modules/@material/mwc-select'
      ),
      '@material/mwc-switch': path.resolve(
        './node_modules/@material/mwc-switch'
      ),
      '@material/mwc-tab': path.resolve('./node_modules/@material/mwc-tab'),
      '@material/mwc-tab-bar': path.resolve(
        './node_modules/@material/mwc-tab-bar'
      ),
      '@material/mwc-textarea': path.resolve(
        './node_modules/@material/mwc-textarea'
      ),
      '@material/mwc-top-app-bar': path.resolve(
        './node_modules/@material/mwc-top-app-bar'
      ),
      '@material/mwc-top-app-bar-fixed': path.resolve(
        './node_modules/@material/mwc-top-app-bar-fixed'
      ),
    },
    extensions: [
      '.mjs',
      '.ts',
      '.tsx',
      '.js',
      '.json',
      '.css',
      '.scss',
      '.html',
    ],
  },
  entry: ['babel-polyfill', './src/index.ts'],
  devServer: {
    historyApiFallback: true,
    port: 8000,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { ie: '11' } }]],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.EnvironmentPlugin({
      WS_INTERFACE: process.env.WS_INTERFACE,
    }),
  ],
};
