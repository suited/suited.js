var config = require('../config')
if (!config.tasks.js) return

var path = require('path')
var webpack = require('webpack')
var webpackManifest = require('./webpackManifest')

module.exports = function(env) {
  var jsSrc = path.resolve(config.root.src, config.tasks.js.src)
  var jsDest = path.resolve(config.root.dest, config.tasks.js.dest)
  var publicPath = path.join(config.tasks.js.dest, '/')
  var filenamePattern = env === 'production' ? '[name]-[hash].js' : '[name].js'
  var extensions = config.tasks.js.extensions.map(function(extension) {
    return '.' + extension
  })

  var webpackConfig = {
    context: jsSrc,
    plugins: [],
    resolve: {
      root: jsSrc,
      extensions: [''].concat(extensions)
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['latest']
        }
      },
      {
        //npm install json-loader --save-dev; // needed so Modules that use JSON as their index can be loaded.
        test: /\.json$/,
        loader: 'json'
      }]
    }
  }

  if (env !== 'test') {
    // Karma doesn't need entry points or output settings
    webpackConfig.entry = config.tasks.js.entries

    webpackConfig.output = {
      path: path.normalize(jsDest),
      filename: filenamePattern,
      publicPath: publicPath
    }

    if (config.tasks.js.extractSharedJs) {
      // Factor out common dependencies into a shared.js
      webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
          name: 'shared',
          filename: filenamePattern,
        })
      )
    }
  }

  if (env === 'development') {
    webpackConfig.devtool = 'source-map'
    webpack.debug = true
  }

  if (env === 'production') {
    webpackConfig.plugins.push(
      new webpackManifest(publicPath, config.root.dest),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.NoErrorsPlugin()
    )
  }

  return webpackConfig
}
