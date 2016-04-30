var webpack = require('webpack');
var path = require('path');

module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS'],

    singleRun: !!process.env.CONTINUOUS_INTEGRATION,

    frameworks: [ 'mocha' ],

    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      'tests.webpack.js'
    ],

    reporters: [ 'mocha', 'coverage' ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ],
    },

    // optionally, configure the reporter
    coverageReporter: {
      reporters: [
        { type: 'json', dir: 'coverage/json' },
        { type: 'html', dir: 'coverage/html' },
        { type: 'text', dir: 'coverage/text' },
      ],
    },

    plugins: [
      require("karma-webpack"),
      require("karma-coverage"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader")
    ],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 10240} },
          { test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.less$/, loader: 'style!css!less' },
          { test: /\.scss$/, loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap' }
        ],
        preLoaders: [
          { test: /\.js$/, include: path.resolve('src/components/'), exclude: /(__tests__|node_modules|bower_components)\//, loader: 'isparta' },
          { test: /\.js$/, include: path.resolve('src/helpers/'), exclude: /(__tests__|node_modules|bower_components)\//, loader: 'isparta' },
        ]
      },
      resolve: {
        modulesDirectories: [
          'src',
          'node_modules'
        ],
        extensions: ['', '.json', '.js']
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }

  });
};
