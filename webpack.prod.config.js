const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name].[hash].css',
    disable: false,
});

const IndexHtml = new HtmlWebpackPlugin({
    filename: './index.html',
    template: path.resolve(__dirname, './src/index.html'),
    inject: 'body',
});

const GameHtml = new HtmlWebpackPlugin({
    filename: './game.html',
    template: path.resolve(__dirname, './src/game.html'),
    inject: 'body',
});

const config = {
    entry: {
        main: './src/js/index.js',
    },

    output: {
        filename: 'main.[hash].js',
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
                use: [{
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                        },
                    },
                    'sass-loader',
                    'resolve-url-loader',
                ],
            }),
        }, {
            test: /\.html$/,
            exclude: [/node_modules/],
            use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                    },
                }],
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
        }, {
            test: /\.(ttf|eot|woff|woff2)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
        }],
    },

    plugins: [
        new CleanWebpackPlugin(['./public']),
        IndexHtml,
        GameHtml,
        extractSass,
        new UglifyJsPlugin(),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'async',
        }),
    ],
};

module.exports = config;
