var gulp         = require('gulp')
var gulpSequence = require('gulp-sequence')


var bumpVersion = function(cb) {
  gulpSequence(
    // 1) Prepare for the release (uses prepareForReleaseTask)
    'version-create',
    // 2) create a tag whose value is the release version from package.json
    'release-promulgate-version',
  cb)
}

// If you are familiar with Rails, this task the equivalent of `rake assets:precompile`
var prepareForReleaseTask = function(cb) {
  gulpSequence(
    // 1) check all files are committed and no pull is needed stops the build if not All committed.
    'git-foo',
    // 2) use the last commitish to create a new version number, add it to package.json then promulgate it to runtime files for use by the app.
    'bump-version',
    // 4) commit a version bump the comment is "bump version: <version number>"
    'git-pre-release-commit-all',
  cb)
}

var releaseTask = function(cb) {
  gulpSequence(
    // 1) Prepare for the release (uses prepareForReleaseTask)
    'release-prepare',
    // 2) create a tag whose value is the release version from package.json
    'git-tag-push',
  cb)
}

var releasePackageTask = function(cb) {
  gulpSequence(
    // 1) clean the build dir
    'clean',
    // 2) create a release.
    'release',
    // 3) package it
    'package',
  cb)
}

// get the last commitish and create a version string from it.
// save that to package.json. Use the version in package.json to promkulgate the version to 
// code that needs to display it at runtime. //TODO could I just read package.json at run time?
gulp.task('bump-version', bumpVersion);

gulp.task('release-prepare', prepareForReleaseTask);

gulp.task('release', releaseTask);

gulp.task('release-package', releasePackageTask);

module.exports = {
    "releaseTask": releaseTask,
    "releasePackage": releasePackageTask
}