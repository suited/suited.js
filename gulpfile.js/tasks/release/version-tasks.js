var config = require('../../config');
if (!config.tasks.release) {
  return;
}

var gulp = require('gulp')
var argv = require('yargs').argv;
var data = require('gulp-data');
var fs = require('fs');
var git = require('gulp-git');
var path = require('path');
var through = require('through2');
var replace = require('gulp-replace');
var handleErrors = require('../../lib/handleErrors');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
//var notify        = require("gulp-notify");

function calcSourceFiles(filenamesArray) {
  var rArray = filenamesArray.map(function (d, i, a) {
    var ret = path.join(config.root.project, config.tasks.release.src, d);
    return ret;
  })
  return rArray;
}

var versionsrcsrcs = calcSourceFiles(config.tasks.release.versionFiles);

//  src: [path.join(config.root.src, config.tasks.package.src, '/**/*'),path.join(config.root.src, config.tasks.html.src, '/**/*.json'), exclude]
var paths = {
  versionsrc: versionsrcsrcs,
  promulgatesrc: config.tasks.release.promulgateVersionFiles,

  // CAUTION distructivly replace the version Files with updated ones. NB this is why this tak cgets 
  // called after a git commit all... so we can roll back if necessary and recommt after to lock it in.
  dest: path.join(config.root.project, config.tasks.release.src)
};

//Git overidable vars modify the scripts in package.json to have " --origin=bitbucket" or append to npm
// command line like "npm run gulp release -- --origin=bitbucket --branch=foo --rbranch=featureFoo"
var origin = argv.origin || config.tasks.release.origin || "origin";
var branch = argv.branch || config.tasks.release.branch || "master";
var remotebranch = argv.rbranch || config.tasks.release.rbranch || "master";

// get the version from package.json file or whatever is defined in config.tasks.release.versionFiles[0]
function getCurrentVersion() {
  var vFilePath = path.resolve(config.root.project, config.tasks.release.versionFiles[0]);
  var pkg = JSON.parse(fs.readFileSync(vFilePath, 'utf8'))
  return pkg.version;
}

var getCommitishFromData = function (vinylfile) {
  if (!!vinylfile.data && !!vinylfile.data.commitish) {
    return vinylfile.data.commitish;
  } else {
    return "DECAD3^7";
  }
}

//NB semver requires package.json has version like
//1.0.0+sha.b6ad73068fd5e7a0fa67e0dda05b71798f1063b0.bd.2016-04-04-231300"
function createPrefix() {
  var now = new Date();
  var day = now.getDate(); //eg 1->31
  var monthIndex = now.getMonth(); // eg 0->11 
  var month = monthIndex + 1;
  var year = now.getFullYear();
  var hour = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  var millisecond = "000"; // now.getUTCMilliseconds(); //now.millisecond();

  return "bd." + year + "-" + month + "-" + day + "-" + hour + min + sec + "-" + millisecond;
}

//gulp plugin func, modifies the JSON content of a vinylfile to add/modify a version
//from the vynal file's data object.. we assum a previous pipeline addes it in
// by default adds prefix then the commitish data from the data object
//NB TODO I could replace this with gulp-json-editor and pass in the version plugin that already exists,
//but wanted to control the plugin.

// see https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md
// and https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md
/**
 * add or modify a "version" property of the JSON "file" passing through this plugin.
 * The version is made up of a prefix and the "commitish" property on file.data as per gulp-data
 * @param versionPrefixText: String. Optional. If not supplied will be created from current datetime
 *   YYYYMMDD-HH_mm_ss_MIll-
 * @param options: Object :- {"commitish": gitCommithash } . if not supplied looks in file.data.commitish as per gulp-data plugin
 *  -- if still not found defaults to "DECAD3^7"
 **/
function pimpVersion(versionPrefixText) {
  if (!versionPrefixText) {
    versionPrefixText = createPrefix();
  }
  prefixText = new Buffer(versionPrefixText); // allocate ahead of time (incase we want to use in buffer concat or stream push)

  // Creating a stream through which each file will pass
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isBuffer()) {
      //get contents as JSON
      var origcontents = JSON.parse(file.contents.toString('utf8'));
      //modify the version or create it, append commitish to the datetime prefix
      var oldVersion = "" + origcontents.version;
      if (!oldVersion) {
        oldVersion = "0.0.1";
      }
      //just replace the stuff after the semver ie metadata after the + if it exists
      origcontents.version = oldVersion.replace(/([^+]*)+?.*/, '$1+' + versionPrefixText + '.' + "commitish." + getCommitishFromData(file));
      //stringify it
      var json = JSON.stringify(origcontents, null, 2); //see https://github.com/morou/gulp-json-editor/blob/master/index.js
      // write it to file
      file.contents = new Buffer(json);
      //      file.contents = Buffer.concat([prefixText, file.contents]);
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      return cb();
      //file.contents = file.contents.pipe(prefixStream(prefixText)); // how to modify JSON in chunks?
      // TODO FIXME perhaps use https://www.npmjs.com/package/JSONStream
    }

    cb(null, file); //pass the new modified file allong in the callback
    // or this.push(file); cb();

  });
}

/**
 * query git to get the last commit hash
 * append it to the vynal file's data object, for use downstream
 **/
var versionCreate = function (cb) {

  var Q = require('q');
  var deferredHash = Q.defer();

  // get the commitish for the last commit as a promise
  git.revParse({
    args: /* '--short */ 'HEAD'
  }, function (err, hash) {
    if (err) {
      deferredHash.reject(err);
    } else {
      console.log('=======>>>>> current git hash: ' + hash);
      if (hash === null || hash === undefined || hash === "") {
        console.log('=======>>>>> Could not find current git hash!!?');
        hash = "nocommithistory";
        // deferredHash.reject("Could not find current git hash!!?");
      }
      deferredHash.resolve({
        'commitish': hash
      });
    }
  });

  //returns the Stream so can be async.
  return gulp.src(paths.versionsrc)
    //stuff the comittish in the data using gulp-data
    .pipe(data(function (f) {
      return deferredHash.promise;
    }))
    .pipe(pimpVersion()) // could pass optional param prefix // looks for file.data.commitish and used it to add a version to file JSON contents
    .pipe(gulp.dest(paths.dest))
}

/**
 * Use gulp-replace to swap out the version in some runtime files (eg config)
 * with the value of version in package.json
 **/
var versionPromulgate = function () {
  //returns the Stream so can be async.
  return gulp.src(paths.promulgatesrc, {
      base: config.root.project //use base so if the arraay contains files in diff dirs we can still pip to dame dest (root) and update them all in place.
    })
    .pipe(replace(/"version": "([^"]*)"/, '"version": "' + getCurrentVersion() + '"'))
    .pipe(gulp.dest(config.root.project))

}

// create a new version string from data and commitish and wack it into package.json
gulp.task('version-create', versionCreate);

// take the version from package.json and spread it about to where its needed, ie constants.js
gulp.task('release-promulgate-version', versionPromulgate);

module.exports = {
  "commitish-version": pimpVersion
}