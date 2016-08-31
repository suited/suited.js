/**
* Release a tag to github and attach artifacts
*
**/
var config = require('../config');
var gulp = require('gulp');
var configRoot = require('../config');
var fs = require('fs');
var path = require('path');
var ghrelease = require('gulp-github-release');
var debug = require('gulp-debug');



 var paths = {
    src: path.join(config.root.dest, config.tasks.githubrelease.src, '/**/*', '*.{js,css}')
  , vFilePath: path.resolve(config.root.project, config.tasks.githubrelease.versionFiles[0])
  , releaseNotes: path.resolve(config.root.project, config.tasks.githubrelease.releaseNotes)
 }


// get the version from package.json file or whatever is defined in config.tasks.release.versionFiles[0]
function getCurrentVersion() {
  var pkg = JSON.parse(fs.readFileSync(paths.vFilePath, 'utf8'))
  return pkg.version;
}

  function getToken() {
    //1 check if in config
    //2 check if in env var GITHUB_TOKEN
    var token = process.env.GITHUB_TOKEN || null;
    return token;
  }

  function readReleaseNotes(){
    var notes = fs.readFileSync(paths.releaseNotes, "utf8");
    return notes;
  }

gulp.task('githubrelease', ['production', 'release'], function(){
  var theToken = getToken();
  var theVersion = getCurrentVersion();
  var theNotes = readReleaseNotes();
  gulp.src(paths.src)
    .pipe(debug())
    .pipe(ghrelease({
      token: theToken,                     // or you can set an env var called GITHUB_TOKEN instead
      // owner: 'suited',                    // if missing, it will be extracted from manifest (the repository.url field)
      repo: 'suited.js',            // if missing, it will be extracted from manifest (the repository.url field)
      tag: getCurrentVersion(),                      // if missing, the version will be extracted from manifest and prepended by a 'v'
      // name: 'publish-release v1.0.0',     // if missing, it will be the same as the tag
      notes: theNotes,                // if missing it will be left undefined
      draft: false,                       // if missing it's false
      prerelease: false,                  // if missing it's false
      manifest: require(paths.vFilePath), // package.json from which default values will be extracted if they're missing
      reuseRelease: true
    }));
});

gulp.task('githubrelease-dryrun',['production'], function(){
  console.log("DRYRUN<<><><><>< token:"+getToken());
  console.log("DRYRUN<<><><><>< version:"+getCurrentVersion());
  console.log("DRYRUN<<><><><>< readReleaseNotes:"+readReleaseNotes());
  console.log("DRYRUN<<><><><>< src: "+ JSON.stringify(paths.src));

  gulp.src(paths.src)
    .pipe(debug());
});
