var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var config = require('../config').lint;

gulp.task('lint', function() {
  return gulp.src(config.src + "/**/*.js")
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
});