// Karma configuration
// Generated on Wed Apr 22 2015 18:33:34 GMT+1000 (AEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
//      'src/main/assets/bower_components/autobahn/autobahn.min.js',
//      'src/main/assets/bower_components/d3/d3.min.js',
//      'node_modules/angular/angular.js',
//      'node_modules/angular-mocks/angular-mocks.js',
//      'src/main/assets/bower_components/angular-bootstrap/ui-bootstrap.min.js',
//      'src/main/assets/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/main/assets/js/**/*.js',
      'src/test/**/*.js'
//      'src/test/services/SettingUtil*.js',
//      'src/test/services/GridUtil*.js'
    ],


    // list of files to exclude
    exclude: [
        'src/main/assets/js/**/app-config.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/main/assets/js/**/*.js': ['browserify'],
      'src/test/**/*.js': ['browserify']
    },
      
    browserify: {
        debug: true,
        extensions: ['.js', '.coffee', '.hbs']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
//    browsers: ['PhantomJS', 'Chrome'],
//    browsers: ['PhantomJS'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
