const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const assetsPath = path.join(__dirname, '/public');

const extractSass = new ExtractTextPlugin({
    filename: '.styles/[name].css',
    disable: true,
});

const IndexHtml = new HtmlWebpackPlugin({
    filename: './index.html',
    template: path.resolve(__dirname, './src/index.html'),
    inject: 'body',
});

const config = {
    entry: {
        main: './src/js/index.js',
    },

    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: [/node_modules/],
            use: [{ loader: 'babel-loader' }],
        }, {
            test: /\.scss$/,
            exclude: [/node_modules/],
            use: extractSass.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader?sourceMap',
                    'sass-loader?sourceMap',
                    'resolve-url-loader',
                ],
            }),
        }, {
            test: /\.html$/,
            exclude: [/node_modules/],
            use: [{ loader: 'html-loader' }],
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
        }, {
            test: /\.(ttf|eot|woff|woff2)$/,
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
        }],
    },

    plugins: [
        IndexHtml,
        extractSass,
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'async',
        }),
    ],

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 9000,
    },
};

fs.readdirSync(assetsPath)
.map((fileName) => {
    if (['.css', '.js'].includes(path.extname(fileName))) {
        return fs.unlinkSync(`${assetsPath}/${fileName}`);
    }

    return '';
});

module.exports = config;
