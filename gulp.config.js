module.exports = function () {
    var buildPath = './build/';
    var buildAppPath = buildPath + 'app/';
    var sourcePath = './src/';


    var config = {
        bowerAll: './bower_components/**',
        buildPath: buildPath,
        buildAppPath: buildAppPath,
        buildApp: buildAppPath + '**',

        sourcePath: sourcePath,
        sourceAll: sourcePath + '**',
        sourceHtml: sourcePath + '*.html',
        sourceCss: sourcePath + 'css/**/*.css',
        sourceApp: sourcePath + 'app/**/*.js',
        rootJs: './*.js',
        buildAppJsFile: 'particle-sandbox.js',
        buildAppCssFile: 'particle-sandbox.css',

        bower: {
            json: require('./bower.json'),
            directory: './build/bower_components/',
            ignorePath: '../..'
        }
    };

    config.sourceOther = [
        config.sourceAll,
        '!'+config.sourceHtml,
        '!'+config.sourceCss,
        '!'+config.sourceApp
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
