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
var ghPages = require('gulp-gh-pages')
var gulp = require('gulp')
var open = require('open')
var os = require('os')
var package = require('../../package.json')
var path = require('path')

var gulpSequence = require('gulp-sequence')


var settings = {
    url: package.homepage,
    demo_src: path.join(config.root.dest, '/**/*'),
    demo_dest: path.join(config.root.dist, config.tasks.deploy.src),
    doc_src: path.join(config.root.project, config.tasks.gendocs.dest, '/**/*'),
    doc_dest: path.join(config.root.dist, config.tasks.deploy.src, config.tasks.gendocs.dest),
    ghPagesSrc: path.join(config.root.dist, config.tasks.deploy.src, '/**/*'),
    ghPages: {
        cacheDir: path.join(os.tmpdir(), package.name)
    }
}

var gatherDemoDoco = function() {
    return gulp.src(settings.demo_src).pipe(gulp.dest(settings.demo_dest))
}

var gatherSuitedDoco = function() {
    return gulp.src(settings.doc_src).pipe(gulp.dest(settings.doc_dest))
}


var deployTask = function() {
    return gulp.src(settings.ghPagesSrc)
        .pipe(ghPages(settings.ghPages))
        .on('end', function() {
            open(settings.url)
        })
}

gulp.task('gather-demo-doco', gatherDemoDoco);
gulp.task('gather-suited-doco', gatherSuitedDoco);

var prepareDeploy = function(cb) {
    gulpSequence('gather-demo-doco', 'gather-suited-doco', cb)
    // gulpSequence('gather-demo-doco', cb)
    // gulpSequence('gather-suited-doco', cb)
}

gulp.task('prepare-deploy', ['production', 'gendocs'], prepareDeploy)

gulp.task('deploy', ['prepare-deploy'], deployTask)

module.exports = deployTask;
