const path              = require('path')
const webpack           = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    context     : __dirname,
    entry       : [
        'babel-polyfill',
        "./ps"
    ],
    output      : {
        publicPath: "/ps",
        path      : __dirname + "/build",
        filename  : "bundle.js"
    },
    watchOptions: {poll: 1000, aggregateTimeout: 300},
    module      : {
        rules: [
            {test: /\.js$/, use: 'babel-loader'},
            {test: /\.jsx$/, use: 'babel-loader'},
            {
                test: /\.less$/,
                use : ExtractTextPlugin.extract({
                    fallback  : "style-loader",
                    use       : ['css-loader', 'less-loader'],
                    publicPath: "/build"
                })
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
