var webpack = require('webpack');

module.exports = {
    entry: './main.js',
    module: {
        loaders: [
            {test: /\.jsx?$/, loader: 'babel?presets[]=react'},
            {test: /\.css$/,  loader: 'style-loader!css-loader!csso'},
            {test: /\.svg$/,  loader: 'url-loader'},
        ]
    },
    output: {
        library: 'hpoAbnormSel',
        libraryTarget: 'var',
        path: __dirname + '/' + process.env.BUILD_TYPE,
        filename: 'hpo-abnorm-sel.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': process.env.BUILD_TYPE == 'debug' ? '"development"' : '"production"',
        }),
    ],
}
