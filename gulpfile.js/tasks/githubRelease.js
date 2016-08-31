var config = require('../config');
var gulp = require('gulp');
var configRoot = require('../config');
var fs = require('fs');;
// var rename = require('gulp-rename');
// var parallelize = require("concurrent-transform");
var path = require('path');
var _ = require('lodash');
var ghrelease = require('gulp-github-release');
var debug = require('gulp-debug');


/**
 * Release a tag to github and attach artifacts
 *
 **/

 var paths = {
    src: path.join(config.root.dest, config.tasks.githubrelease.src, '/**/*', '*.{js,css}')
  , vFilePath: path.resolve(config.root.project, config.tasks.githubrelease.versionFiles[0])
  , releaseNotes: path.resolve(config.root.project, config.tasks.githubrelease.releaseNotes)
 }


function envVarCreds() {
  var ret = {};
  var k = process.env.AWS_ACCESS_KEY_ID || null;
  var s = process.env.AWS_SECRET_ACCESS_KEY || null;
  var r = process.env.AWS_REGION || null;
  var b = process.env.AWS_BUCKET || null;
  if (k) {
    ret.key = k;
  }
  if (s) {
    ret.secret = s;
  }
  if (r) {
    ret.secret = r;
  }
  if (b) {
    ret.secret = b;
  }
  return ret;
};

/**
 * build creds or throw an error
 * look up from config.creds then ie ENV VAR, then ~/.s3SuitedCredentials
 * first value found sticks.
 */
function buildCreds() {
  var confCreds = config.creds;
  var envCreds = envVarCreds();
  var fileCreds = parseIntoCreds(fs.readFileSync("" + getUserHome() + "/.s3SuitedCredentials", "utf8"));
  var confBucket = {};
  if (config.bucket) confBucket.bucket = config.bucket;

  //chain definitions to create first com first served creds
  var creds = _.defaults({}, confBucket, confCreds, envCreds, fileCreds);

  if (!creds.key) {
    throw new Error('Missing config `key`');
  }
  if (!creds.secret) {
    throw new Error('Missing config `secret`');
  }
  if (!creds.region) {
    throw new Error('Missing config `region`');
  }
  if (!creds.bucket) {
    throw new Error('Missing config `bucket`');
  }
  console.log("creds are : " + JSON.stringify(creds, null, 2));
  return creds;
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function parseIntoCreds(contents) {
  var ret = {};
  var keyRe = /(AWS_ACCESS_KEY_ID)=(.*)$/;
  var secretRe = /(AWS_SECRET_ACCESS_KEY)=(.*)$/;
  var regionRe = /(AWS_REGION)=(.*)$/;
  var bucketRE = /(AWS_BUCKET)=(.*)$/;

  arrayOfLines = contents.match(/[^\r\n]+/g);
  console.log("arrayoflines is " + JSON.stringify(arrayOfLines, null, 2));
  arrayOfLines.forEach(function (d, i, a) {
    if (d.substring(0, "#".length) === "#") return;
    if (d.match(keyRe)) {
      ret.key = d.match(keyRe)[2];
    } else if (d.match(secretRe)) {
      ret.secret = d.match(secretRe)[2];
    } else if (d.match(regionRe)) {
      ret.region = d.match(regionRe)[2];
    } else if (d.match(bucketRE)) {
      ret.bucket = d.match(bucketRE)[2];
    }
  });
  return ret;
}



// get the version from package.json file or whatever is defined in config.tasks.release.versionFiles[0]
function getCurrentVersion() {
  var pkg = JSON.parse(fs.readFileSync(paths.vFilePath, 'utf8'))
  return pkg.version;
}

  function getToken() {
    //1 check if in config
    //2 check if in env var GITHUB_TOKEN
    //3 ask USER 3ae7420a539661f35b84f949956b7d67dd59f477
    var token = "3ae7420a539661f35b84f949956b7d67dd59f477";
    console.log("<><><><>< GITHUB release using token: "+ token);
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
  console.log("<<><><><>< token:"+theToken);
  console.log("<<><><><>< version:"+ theVersion);
  // console.log("<<><><><>< readReleaseNotes:" + theNotes);
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
