module.exports = entry => {

    const path              = require('path')
    const webpack           = require('webpack')
    const ExtractTextPlugin = require('extract-text-webpack-plugin')

    return {
        context     : __dirname,
        entry       : [
            'babel-polyfill',
            entry
        ],
        output      : {
            publicPath: "/app",
            path      : __dirname + "/www/build",
            filename  : "bundle.js"
        },
        watchOptions: {poll: 1000, aggregateTimeout: 300},
        module      : {
            rules: [
                {test: /\.js$/, use: 'babel-loader'},
                {test: /\.jsx$/, use: 'babel-loader'},
                {test: /\.css/, use: 'css-loader'},
                {
                    test: /\.less$/,
                    use : ExtractTextPlugin.extract({
                        fallback  : "style-loader",
                        use       : ['css-loader', 'less-loader'],
                        publicPath: "/build"
                    })
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use : [
                        'url-loader?limit=10000',
                        'img-loader'
                    ]
                },
            ]
        },
        plugins     : [
            new ExtractTextPlugin({
                filename : "bundle.css",
                //disable  : false,
                allChunks: true
            })
        ]
    }

}