module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        publicPath: 'dist'
    },
    stats: 'errors-only',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
