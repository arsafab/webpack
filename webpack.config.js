const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'prod';
const assetsPath = path.join(__dirname, '/public');
const extractSass = new ExtractTextPlugin({
    filename: isProduction ? '[name].[hash].css' : '.styles/[name].css',
    disable: !isProduction,
});

const config = {
    entry: {
        main: './src/index.js',
    },

    output: {
        filename: isProduction ? 'main.[hash].js' : 'main.js',
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
                        {
                            loader: isProduction ? 'css-loader' : 'css-loader?sourceMap',
                            options: { minimize: isProduction },
                        },
                        {
                            loader: isProduction ? 'sass-loader' : 'sass-loader?sourceMap',
                        },
                        'resolve-url-loader',
                    ],
            }),
        }, {
            test: /\.html$/,
            exclude: [/node_modules/],
            use: [{
                loader: 'html-loader',
                options: { minimize: isProduction },
            }],
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
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: path.resolve(__dirname, './src/index.html'),
            inject: 'body',
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'async',
        }),
        extractSass,
    ],

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 8080,
    },
};

if (isProduction) {
    config.plugins.push(new CleanWebpackPlugin(['./public']));
    config.plugins.push(new UglifyJsPlugin());
}

fs.readdirSync(assetsPath)
.map((fileName) => {
    if (['.css', '.js'].includes(path.extname(fileName))) {
        return fs.unlinkSync(`${assetsPath}/${fileName}`);
    }

    return '';
});

module.exports = config;

