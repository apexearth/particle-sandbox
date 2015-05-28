/* jshint -W079 */
var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({lazy: true});
var del = require('del');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var wiredep = require('wiredep');

gulp.task('default', [
    'check',
    'build',
    'inject'
]);

gulp.task('browser', [
    'watch:reload',
    'default'
], function () {
    startBrowserSync();
});

gulp.task('deploy', ['default'], function () {
    var s3 = require('gulp-s3-upload')({
        accessKeyId: "AKIAIBSIXFUW27R23UEQ",
        secretAccessKey: ""
    });
    gulp.src(config.buildAll)
        .pipe(s3({
            Bucket: 'apexearth-particlesandbox',
            ACL: 'public-read'
        }));
});


gulp.task('watch:reload', function () {
    gulp.watch([
        config.sourceAll
    ], ['reload']);
});
gulp.task('reload', ['default'], function () {
    if (browserSync.active) {
        browserSync.reload();
    }
});

gulp.task('check', function () {
    return gulp.src([
        config.sourceAppJs,
        config.rootJs
    ])
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});
gulp.task('clean:build', ['check'], function (done) {
    del([
        config.buildPath
    ], done);
});

gulp.task('build', ['build:html', 'build:css', 'build:app', 'build:other', 'build:bower']);
gulp.task('build:app', ['clean:build', 'check'], function () {
    var browserified = transform(function (filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src('./src/app/index.js', {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe(browserified)
        .pipe($.if(args.minify, $.uglify()))
        .pipe($.concat(args.minify ? config.buildAppMinJsFile : config.buildAppJsFile))
        .pipe(gulp.dest(config.buildAppPath));
});
gulp.task('build:css', ['clean:build', 'check'], function () {
    return gulp.src([
        config.sourceCss,
        config.sourceAppCss,
        config.sourceAppLess,
        '!./src/css/mobile.css'
    ])
        .pipe($.less({ paths: [] }))
        .pipe($.if(args.verbose, $.print()))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.if(args.minify, $.uglifycss()))
        .pipe($.concat(args.minify ? config.buildAppMinCssFile : config.buildAppCssFile))
        .pipe(gulp.dest(config.buildAppPath));
});
gulp.task('build:html', ['clean:build', 'check'], function () {
    return gulp.src(config.sourceHtml, {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe(gulp.dest(config.buildPath));
});
gulp.task('build:other', ['clean:build', 'check'], function () {
    return gulp.src(config.sourceOther, {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe(gulp.dest(config.buildPath));
});
gulp.task('build:bower', ['clean:build', 'check'], function () {
    var options = config.getWiredepOptions();
    var injections = wiredep(options);
    var injectionArr = injections.js.concat(injections.css);
    injectionArr.push(options.directory+'**/.*bower.json');
    return gulp.src(injectionArr, {base: './'})
        .pipe($.if(args.verbose, $.print()))
        .pipe(gulp.dest(config.buildPath));
});

gulp.task('inject', ['check', 'build'], function () {
    var options = config.getWiredepOptions();
    options.directory = config.buildPath + options.directory.substring(2);
    return gulp.src(config.buildPath + 'desktop.html')
        .pipe(wiredep.stream(options))
        .pipe($.inject(gulp.src([
            config.buildApp
        ]), {
            ignorePath: config.buildPath.substring(2),
            addRootSlash: false
        }))
        .pipe($.if(args.minify, $.minifyHtml()))
        .pipe(gulp.dest(config.buildPath));
});


function startBrowserSync() {
    if (browserSync !== null && browserSync.active) return;

    var options = {
        server: config.buildPath,
        reloadDelay: 1000
    };
    browserSync.init(options);
}
