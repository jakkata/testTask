const path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, 'src','Main.js'),
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'build.js'
    },

    module: {
        loaders: [
            {
                test: /\.jade$/,
                loader: 'jade',
                query: {
                    sourceMap:true,
                    root: __dirname,
                    namespace: false
                }
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015','stage-1'],
                    plugins: [
                        'typecheck',
                        'transform-flow-strip-types',
                        'transform-class-properties',
                        'transform-runtime',
                    ]
                }
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    },
    resolve: {
        root: [
            path.resolve('.')
        ],
        modulesDirectories: [
            'node_modules'
        ]
    }
};