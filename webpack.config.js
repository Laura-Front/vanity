const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");

const isDev = process.env.NODE_ENV === 'development';
console.log('isDev -- ', isDev);

const prodPlugins = [
    new ImageMinimizerPlugin({
        minimizerOptions: {
            plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 5 }],
                [
                    "svgo",
                    {
                        plugins: extendDefaultPlugins([
                            {
                                name: "removeViewBox",
                                active: false,
                            },
                            {
                                name: "addAttributesToSVGElement",
                                params: {
                                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                                },
                            },
                        ]),
                    },
                ],
            ],
        },
    }),
];

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: process.env.NODE_ENV,
    entry: {
        'imports': './imports.js',
        'main': './index.js',
        'procedures': './js/procedures.js',
        'clinics': './js/clinics.js',
        'slider': './js/slider.js',
        'doctors': './js/doctors.js',
        'calendar': './js/calendar.js',
        'text-editor': './js/text-editor.js',
        'select2': './js/select2.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'images/[name][ext][query]'
    },
    devServer: {
        public: 'vanity.loc',
    },
    plugins: [...[
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/images'),
                    to: path.resolve(__dirname, 'dist/images'),
                },
            ],
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })], ...(isDev ? [] : prodPlugins)
    ],
    module: {
        rules: [
            {
                test: /\.(?:scss|css)$/i,
                use: [
                    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource'
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    },

};