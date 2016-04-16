'use strict';
let webpack =   require(`webpack`);
module.exports  =   {
    entry: './app.jsx',
    output: {
        path: __dirname + '/dist/js',
        filename: 'app-bundle.js'
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};