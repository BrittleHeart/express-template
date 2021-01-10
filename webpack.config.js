const path = require('path')
const nodeExternals = require('webpack-node-externals')
this.cliEngine = require("eslint").CLIEngine;

module.exports = {
    entry: './server.js',
    output: {
        filename: 'server.bundle.js',
        publicPath: '/',
        path: path.resolve('./dist'),
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader', 'eslint-loader'],
                exclude: /node_modules/,
            },
        ],
    },
}