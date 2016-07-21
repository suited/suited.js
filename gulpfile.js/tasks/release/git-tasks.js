var config = require('../../config');
if (!config.tasks.release) {
  return;
}

var gulp = require('gulp')
var argv = require('yargs').argv;
var fs = require('fs');
var git = require('gulp-git');
var path = require('path');
var notify = require("gulp-notify");
var data = require('gulp-data');
var gulpSequence = require('gulp-sequence');
var handleErrors = require('../../lib/handleErrors');

//var exclude = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**')
function calcSourceFiles(filenamesArray) {
  var rArray = filenamesArray.map(function (d, i, a) {
    var ret = path.join(config.root.project, config.tasks.release.src, d);
    return ret;
  });

  
  rArray = rArray.concat(config.tasks.release.promulgateVersionFiles);
  return rArray;
}

var versionsrcsrcs = calcSourceFiles(config.tasks.release.versionFiles);

var paths = {
  //  src: [path.join(config.root.src, config.tasks.package.src, '/**/*'),path.join(config.root.src, config.tasks.html.src, '/**/*.json'), exclude],
  src: [path.join(config.root.project, config.tasks.release.src, '/**/*')],
  dest: path.join(config.root.dist, config.tasks.release.dest),
  modversionsrcsrc: versionsrcsrcs
};


// get the version from package.json file or whatever is defined in config.tasks.release.versionFiles[0]
function getCurrentVersion() {
  var vFilePath = path.resolve(config.root.project, config.tasks.release.versionFiles[0]);
  var pkg = JSON.parse(fs.readFileSync(vFilePath, 'utf8'))
  return pkg.version;
}

//Git overidable vars
var origin = argv.origin || config.tasks.release.origin || "origin";
//var origin = "bb";
var branch = argv.branch || config.tasks.release.branch || "master";
//var branch = "master";
var remotebranch = argv.rbranch || config.tasks.release.rbranch || "master";
//var remotebranch = "master";

var gitPreRelease = function () {
  var currentVersion = getCurrentVersion();
  return gulp.src(paths.modversionsrcsrc)
    // add all modified newly added files and delete deleted files
    .pipe(git.add({
      args: '-A'
    }))
    .pipe(git.commit('pre-release commit, version bumped to:- ' + currentVersion, {
      args: '-s'
    }));

  //       commit the files amend the tip so added files are not a new commit but absorbed into previous 
  //       cool but means the commitish in the tag doesn't match a commitish in the history any more.
  //      .pipe(git.commit('pre-release commit, version bumped to:XXX', {args: '--amend -s'}));
}

var errfunc = function (err) {
  if (err) throw err;
};



//git async task callback used to let git know if it worked or failed
var gitStatusCommited = function (cb) {
  git.status({
    args: '--porcelain'
  }, function (err, stdout) {
    if (err) {
      cb(err); //throw err;
    }
    if (stdout === "") {
      console.log("=======>>>>> All code is committed OK");
      cb();
    } else {
      console.log("=======>>>>> NOT All code is committed! Git status is:- " + stdout);
      cb(new Error("NOT All code is committed!, git status is:- " + stdout));
    }

  });
}

var gitTag = function () {
  git.tag(getCurrentVersion(), 'Release Version Tag - '+ getCurrentVersion(), {
    cwd: paths.src
  }, errfunc);
};

var gitPushTag = function () {
  git.push(origin, branch, {
    args: '--tags',
    cwd: paths.src
  }, errfunc);
};

var gitTagPushVersion = function (cb) {
  gulpSequence(
    // 1) tag
    'git-tag',
    // 2) push branch with tags
    'git-push-tag',
    cb)
}

gulp.task('git-pre-release-noting-to-commit', gitStatusCommited);

gulp.task('git-foo', ['git-pre-release-noting-to-commit'], function (cb) {
  console.log("Safe to continue release tagging.");
  cb();
});

// commit all the files - be carefull will add all files with "git add -A" commit comment is pre-release if it needs to do anything.
gulp.task('git-pre-release-commit-all', gitPreRelease);

// 2) create a tag whose value is the release version from package.json
gulp.task('git-tag', gitTag);

gulp.task('git-push-tag', gitPushTag);

// 4) commit a version bump the comment is "bump version: <version number>"
gulp.task('git-tag-push', gitTagPushVersion);

module.exports = {
  "gitPreRelease": gitPreRelease,
  "gitTag": gitTag,
  "gitTagPush": gitTagPushVersion
}