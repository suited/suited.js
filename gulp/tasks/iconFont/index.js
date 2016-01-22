var changed = require('gulp-changed');
var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var config = require('../../config');
var generateIconSass = require('./generateIconSass');

gulp.task('iconFont', function () {
    var cfg = config.iconFonts
    return gulp.src(cfg.src)
        .on('codepoints', generateIconSass)
        .pipe(gulp.dest(cfg.dest));
});
