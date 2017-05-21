const gulp = require('gulp')
const s3   = require('gulp-s3-upload')({useIAM: true})

gulp.task("upload", function () {
    gulp.src([
        "./build/**",
        "./css/**",
        "./fonts/**",
        "./index.html",
    ], {base: './'})
        .pipe(s3({
            Bucket: 'particlesandbox.com',
            ACL   : 'public-read'
        }, {
            // S3 Constructor Options, ie:
            maxRetries: 5
        }))
})
