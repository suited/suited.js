/**
* @Author: Roberts Karl <Karl_Roberts>
* @Date:   2016-Aug-02
* @Project: suited
* @Last modified by:   Karl_Roberts
* @Last modified time: 2016-Aug-03
* @License: Copyright 2016 Karl Roberts <karl.roberts@owtelse.com> and Dirk van Rensburg <dirk.van.rensburg@gmail.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/



var config = require('../config')
if (!config.tasks.gendocs) {
  return;
}

var gulp   = require('gulp')
var del    = require('del')
var shell = require('gulp-shell')
var gulpSequence = require('gulp-sequence')
var path        = require('path')

var settings = {
  src: path.join(config.root.project, config.tasks.gendocs.src,  '/**/*', '*.{html}'),
  dest: path.join(config.root.project, config.tasks.gendocs.dest)
}

gulp.task('cleanDocsDir', function () {
  del([settings.dest]);
});

gulp.task('mkdocs', shell.task(['mkdocs build']));

// gulp.task('copyOthers', function () {
//   return gulp.src(settings.src).pipe(gulp.dest(settings.dest));
// });

var gendocsTask = gulp.task('gendocs', gulpSequence('cleanDocsDir','mkdocs'/*, 'copyOthers' */));
module.exports = gendocsTask;