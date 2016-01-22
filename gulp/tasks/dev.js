var gulp = require('gulp');

gulp.task('dev', ['markup', 'images', 'iconFont', 'glyphIcons', 'minifyCss', 'uglifyJs', 'genie', 'publiclibs']);
