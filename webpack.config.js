module.exports = {
    context: __dirname,
    entry: "./ps",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
    watchOptions: { poll: 1000, aggregateTimeout: 300 }
}
