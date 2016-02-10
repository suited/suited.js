var target = "./target"
var dest = target + "/dist"
var src = "./src"
var maindir = src + "/main"
var app = maindir + "/assets"
var sass_assets = app + "/sass/_sass-assets"
var node_modules = "./node_modules"

module.exports = {
    clean: {
        target: ['target/**/*',
						sass_assets
						]
    },
    lint: {
        src: app
    },
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    },
    bootstrapSass: {
        //    src: app + "/sass/**/*.{sass,scss}",
        src: node_modules + "/bootstrap-sass/assets/**/*",
        dest: sass_assets + "/bootstrap-sass"
    },
    sass: {
        //    src: app + "/sass/**/*.{sass,scss}",
        src: app + "/sass/**/*.{sass,scss}",
        dest: dest + "/css"
    },
    images: {
        src: app + "/images/**/*",
        dest: dest + "/images"
    },
    markup: {
        src: [app + "/htdocs/**/*.html", app + "/htdocs/**/*.properties", app + "/htdocs/**/*.php", app + "/htdocs/**/*.xml", app + "/htdocs/**/*.json"],
        dest: dest
    },
    iconFonts: {
        name: 'Gulp Starter Icons',
        src: src + '/icons/*.svg',
        dest: dest + '/fonts',
        sassDest: src + '/sass',
        template: './gulp/tasks/iconFont/template.sass.swig',
        sassOutputName: '_icons.sass',
        fontPath: 'fonts',
        className: 'icon',
        options: {
            fontName: 'Post-Creator-Icons',
            appendCodepoints: true,
            normalize: false
        }
    },
    glyphIcons: {
        name: 'Bootstrap Glyph Icons',
        src: node_modules + '/bootstrap-sass/assets/fonts/**/*',
        dest: dest + '/fonts'
    },
    publiclibs: {
        src: maindir + "/public/**/*",
        dest: dest + "/js/lib"
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [
    /*{
      entries: app + '/javascript/global.coffee',
      dest: dest,
      outputName: 'global.js',
      // Additional file extentions to make optional
      extensions: ['.coffee', '.hbs'],
      // list of modules to make require-able externally
      require: ['jquery', 'backbone/node_modules/underscore']
      // See https://github.com/greypants/gulp-starter/issues/87 for note about
      // why this is 'backbone/node_modules/underscore' and not2 'underscore'
    },*/
//    {
//        entries: app + '/js/angular-stuff.js',
//        dest: dest + '/js',
//        outputName: 'angular-bundle.js',
//        // list of externally available modules to exclude from the bundle
//        // external: [ 'angular', 'jquery', 'underscore']
//    },
            {
                entries: app + '/js/startup.js',
                dest: dest + '/js',
                outputName: 'bundle.js',
                // list of externally available modules to exclude from the bundle
                external: ['jquery', 'underscore']
    }]
    },
    production: {
        cssSrc: dest + '/css/*.css',
        cssDest: dest + '/css',
        jsSrc: dest + '/js/*.js',
        jsDest: dest + '/js'
    },
    publish: {
        src: dest + '/**/*',
        bucket: "test.aws.owtelse.com",
        // Either set Creds here in knox style or have a file in AWS defined format at ~/.s3SuitedCredentials like
        //AWS_ACCESS_KEY_ID=somekeyID
        //AWS_SECRET_ACCESS_KEY=somekeysecret
        //AWS_REGION=us-east-1
        //AWS_BUCKET=test.aws.owtelse.com
        creds: {
            //            key: "AWS_ACCESS_KEY_ID",
            //            secret: "AWS_SECRET_ACCESS_KEY",
            //            region: "ap-southeast-2",
            //            bucket: "owtelse-repo-oss"
        },
        s3Prefix: "suited/"

    }


};
