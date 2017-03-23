module.exports = {
    context     : __dirname,
    entry       : "./ps",
    output      : {
        path    : __dirname + "/build",
        filename: "bundle.js"
    },
    watchOptions: {poll: 1000, aggregateTimeout: 300},
    module      : {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/}
        ]
    }
}
