module.exports = {
    mode: 'production',
    entry: './src/Gridmap/Gridmap.js',
    output: {
        filename: 'gridmap.min.js',
        path: __dirname + '/umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
