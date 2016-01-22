var gulp = require('gulp');

// Run this to compress all the things!
gulp.task('production', [], function(){
//gulp.task('production', [], function(){
  // This runs only if the karma tests pass
//  gulp.start(['markup', 'images', 'iconFont', 'minifyCss', 'uglifyJs', 'genie', 'publiclibs'])
  gulp.start(['markup', 'images', 'iconFont', 'glyphIcons', 'minifyCss', 'browserify', 'publiclibs'])
});
