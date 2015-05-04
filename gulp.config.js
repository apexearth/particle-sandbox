module.exports = function () {

    var config = {
        buildPath: './build/',
        other: [
            './src/fonts/**',
            './src/img/**',
            './src/json/**'
        ],
        sourcePath: './src/',
        sourceAll: './src/**',
        sourcehtml: './src/*.html',
        sourcecss: './src/css/**/*.css',
        sourcejs: './src/js/**/*.js',
        lib: './src/lib/**/*',
        rootjs: './*.js',
        outputjs: 'particle-sandbox.js',
        outputcss: 'particle-sandbox.css'
    };

    return config;

};
