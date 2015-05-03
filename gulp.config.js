module.exports = function () {

    var config = {
        build: './build/',
        outputjs: 'particle-sandbox.js',
        sourcePath: './src/',
        other: [
            './src/fonts/**',
            './src/img/**',
            './src/json/**'
        ],
        outputcss: 'particle-sandbox.css',
        sourcehtml: './src/*.html',
        sourcecss: './src/css/**/*.css',
        sourcejs: './src/js/**/*.js',
        lib: './src/lib/**/*',
        rootjs: './*.js'
    };

    return config;

};
