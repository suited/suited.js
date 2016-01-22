/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp = require('gulp');
var config = require('../config');

var isWatching = false;

gulp.task('watch', ['watchify', 'browserSync'], function () {
	isWatching = true;
	gulp.watch(config.markup.src, ['markup']);
	gulp.watch(config.sass.src, ['sass']);
	gulp.watch(config.images.src, ['images']);
	gulp.watch(config.publiclibs.src, ['publiclibs']);
	// Watchify will watch and recompile our JS, so no need to gulp.watch it
});

gulp.on('stop', function () {
	if (!isWatching) {
		process.nextTick(function () {
			process.exit(0);
		});
	}
});
