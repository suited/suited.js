var gulp   = require('gulp')
var del    = require('del')
var config = require('../config')
var shell = require('gulp-shell')
var gulpSequence = require('gulp-sequence')
var path        = require('path')

gulp.task('cleanDocsDir', function () {
  del([config.root.doc_site]);
});

gulp.task('mkdocs', shell.task(['mkdocs build']));

gulp.task('copyOthers', function () {
  return gulp.src(path.join(config.root.docs,'*.{html}')).pipe(gulp.dest(config.root.doc_site));
});

var gendocsTask = gulp.task('gendocs', gulpSequence('cleanDocsDir','mkdocs', 'copyOthers'));
module.exports = gendocsTask;
