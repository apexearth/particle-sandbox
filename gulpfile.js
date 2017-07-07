const pkg  = require('./package.json')
const gulp = require('gulp')
const s3   = require('gulp-s3-upload')({useIAM: true})

uploadTask("upload", "")
uploadTask("upload-develop", "develop/")
uploadTask("upload-version", `version/${pkg.version}/`)

function uploadTask(name, prefix) {
    gulp.task(name, function () {
        gulp.src([
            "./build/**",
            "./css/**",
            "./fonts/**",
            "./index.html",
        ], {base: './'})
            .pipe(s3({
                Bucket      : 'particlesandbox.com',
                ACL         : 'public-read',
                keyTransform: file => prefix + file
            }, {
                // S3 Constructor Options, ie:
                maxRetries: 5
            }))
    })

}