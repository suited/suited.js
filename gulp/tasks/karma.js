var gulp = require('gulp');
var karma = require('karma').server;

var karmaTask = function(done) {
  karma.start({
    configFile: process.cwd() + '/karma.conf.js',
    singleRun: true
  }, done);
};

gulp.task('karma', karmaTask);

module.exports = karmaTask;
