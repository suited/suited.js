var gulp = require('gulp');
var config = require('../config.js').clean;
var del = require('del');

gulp.task('clean:target', function (cb) {
  del(config.target, cb);
});

gulp.task('clean',['clean:target'])


// //example of how to clean files in apipeline
//var vinylPaths = require('vinyl-paths');
//
//gulp.task('clean:tmp', function () {
//  return gulp.src('tmp/*')
//    .pipe(stripDebug())
//    .pipe(gulp.dest('dist'))
//    .pipe(vinylPaths(del));
//});
