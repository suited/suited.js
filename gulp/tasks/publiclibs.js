var gulp = require('gulp');
var config = require('../config').publiclibs;
var browserSync  = require('browser-sync');

gulp.task('publiclibs', function() {
    console.log("gonna do publiclibs input = "+ config.src +" ... output = " + config.dest);
    return gulp.src(config.src)
      .pipe(gulp.dest(config.dest))
      .pipe(browserSync.reload({stream:true}));
});
