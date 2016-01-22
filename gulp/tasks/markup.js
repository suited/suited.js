var gulp = require('gulp');
var config = require('../config').markup;
var browserSync  = require('browser-sync');

gulp.task('markup', function() {
    console.log("gonna do markup input = "+ config.src +" ... output = " + config.dest);
    return gulp.src(config.src)
      .pipe(gulp.dest(config.dest))
      .pipe(browserSync.reload({stream:true}));
});
