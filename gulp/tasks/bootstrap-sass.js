/**
This task is needed to pull the bootstrap-sass code closer to my scss file
So that sourceMaps tas is happy... otherwise it gets it's knickers in twist
and says that 
Error: "/node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss" is not in the SourceMap.

*/
var gulp = require('gulp');
var config = require('../config').bootstrapSass;

gulp.task('bootstrap-sass', function () {
	console.log("src = " + config.src);
	console.log("dest= " + config.dest);

	return gulp.src(config.src)
		.pipe(gulp.dest(config.dest));
});
