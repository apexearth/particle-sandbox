module.exports = function () {
    var buildPath = './build/';
    var buildAppPath = buildPath + 'app/';
    var sourcePath = './src/';


    var config = {
        bowerAll: './bower_components/**',
        buildPath: buildPath,
        buildAll: buildPath + '**',
        buildLib: buildPath + 'lib/**',
        buildAppPath: buildAppPath,
        buildApp: buildAppPath + '**/*.*',

        sourcePath: sourcePath,
        sourceAll: sourcePath + '**',
        sourceLib: sourcePath + 'lib/**',
        sourceHtml: sourcePath + '**/*.html',
        sourceCss: sourcePath + 'css/**/*.css',
        sourceAppCss: sourcePath + 'app/**/*.css',
        sourceAppLess: sourcePath + 'app/**/*.less',
        sourceAppJs: sourcePath + 'app/**/*.js',

        rootJs: './*.js',

        buildAppJsFile: 'particle-sandbox.js',
        buildAppMinJsFile: 'particle-sandbox.min.js',
        buildAppCssFile: 'particle-sandbox.css',
        buildAppMinCssFile: 'particle-sandbox.min.css',

        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        }
    };

    config.sourceOther = [
        config.sourceAll,
        '!' + config.sourceHtml,
        '!' + config.sourceCss,
        '!' + config.sourceAppCss,
        '!' + config.sourceAppJs
    ];

    config.getWiredepOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;

};
