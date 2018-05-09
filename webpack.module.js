module.exports = {
    mode: 'production',
    entry: './src/Boilerplate/Boilerplate.js',
    output: {
        filename: 'boilerplate.min.js',
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
