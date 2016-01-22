var gulp = require('gulp');
var config = require('../config').genie;
var browserSync  = require('browser-sync');

gulp.task('genie', ['genieconf'], function() {
    console.log("gonna do genie input = "+ config.src +" ... output = " + config.dest);
    return gulp.src(config.src)
      .pipe(gulp.dest(config.dest))
      .pipe(browserSync.reload({stream:true}));
});
