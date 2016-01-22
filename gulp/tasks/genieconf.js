var gulp = require('gulp');
var config = require('../config').genieconf;
var browserSync  = require('browser-sync');

gulp.task('genieconf', function() {
    console.log("gonna do genieconf input = "+ config.src +" ... output = " + config.dest);
    return gulp.src(config.src)
      .pipe(gulp.dest(config.dest))
      .pipe(browserSync.reload({
          stream: true
      }));
});
