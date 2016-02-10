var gulp = require('gulp');
var _ = require('lodash');
var jshint = require('gulp-jshint');
var config = require('../config').publish;
var fs = require('fs');
var s3 = require("./mys3.js");
var gzip = require("gulp-gzip");
var rename = require('gulp-rename');
var parallelize = require("concurrent-transform");


var awspublish = require('gulp-awspublish');

/**
 * Publish gzipped js file to S3 bucket
 *
 **/

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



gulp.task('publish', function () {

    //    console.log("publish");
    var creds = buildCreds();

    var thePrefix = (config.s3Prefix) ? config.s3Prefix : "";

    var publisher = awspublish.create({
        params: {
            Bucket: creds.bucket
        },
        accessKeyId: creds.key,
        secretAccessKey: creds.secret,
        //                profile: "suited"
    });

    // define custom headers 
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
            // ... 
    };

    console.log("Finding files at:- " + config.src)

    return gulp.src(config.src)
        .pipe(rename(function (path) {
            path.dirname = thePrefix + path.dirname;
        }))
        .pipe(awspublish.gzip())
        .pipe(parallelize(publisher.publish(headers, {
                                force: true
                            })), 10)
//        .pipe(publisher.publish(headers, {
                  //            force: true
                  //        }))
        .pipe(publisher.sync(thePrefix))
        .pipe(awspublish.reporter({
            states: ['create', 'update', 'delete']
        }));

});
