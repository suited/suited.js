/**
This task is needed to pull the bootstrap-sass code closer to my scss file
So that sourceMaps tas is happy... otherwise it gets it's knickers in twist
and says that 
Error: "/node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss" is not in the SourceMap.

*/
var config = require('../config');
if (!config.tasks.bootstrapSass) return;

var gulp = require('gulp');
var path = require('path');

var paths = {
  src: path.join(config.node_modules.src, config.tasks.bootstrapSass.src, '/**/*'),

  //NB dest is a src location for css prevent checkin with .gitignore
  dest: path.join(config.root.src, config.tasks.css.src, config.tasks.bootstrapSass.dest)
}

gulp.task('bootstrap-sass', function () {
  console.log("src = " + paths.src);
  console.log("dest= " + paths.dest);

  return gulp.src(paths.src)
    .pipe(gulp.dest(paths.dest));
});
