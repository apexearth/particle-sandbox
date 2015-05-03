/* jshint -W079 */
var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var $ = require('gulp-load-plugins')({lazy: true});
var del = require('del');
var transform = require('vinyl-transform');
var browserify = require('browserify');

gulp.task('default', [
    'clean:build',
    'check',
    'build:js',
    'build:css',
    'build:html',
    'build:lib',
    'build:other'
]);

gulp.task('clean:build', function (done) {
    del([
        config.build
    ], done);
});

gulp.task('check', ['clean:build'], function () {
    return gulp.src([
        config.sourcejs,
        config.rootjs
    ])
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('build:js', ['check'], function () {
    var browserified = transform(function (filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src('./src/js/index.js', {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe(browserified)
        .pipe($.uglify())
        .pipe($.concat(config.outputjs))
        .pipe(gulp.dest(config.build));
});

gulp.task('build:css', ['check'], function () {
    return gulp.src(config.sourcecss, {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe($.uglifycss())
        .pipe(gulp.dest(config.build));
});

gulp.task('build:html', ['check'], function () {
    return gulp.src(config.sourcehtml, {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe($.minifyHtml())
        .pipe(gulp.dest(config.build));
});

gulp.task('build:lib', ['check'], function () {
    return gulp.src(config.lib, {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe(gulp.dest(config.build));
});

gulp.task('build:other', ['check'], function () {
    return gulp.src(config.other, {base: config.sourcePath})
        .pipe($.if(args.verbose, $.print()))
        .pipe(gulp.dest(config.build));
});
