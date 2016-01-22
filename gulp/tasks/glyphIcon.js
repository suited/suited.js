var gulp = require('gulp');
var config = require('../config').glyphIcons;

gulp.task('glyphIcons', function () {
    return gulp.src([config.src + '/**/*'])
        .pipe(gulp.dest(config.dest));
});
