const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')

module.exports = merge(
  common,
  /** @type {import('webpack').Configuration} */ {
    devtool: 'eval-source-map',
    devServer: {
      port: 8080,
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
  }
)
