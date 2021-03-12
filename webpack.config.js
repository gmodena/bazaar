const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

popup_config = {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
        minimize: false
    },
    entry: {
        popup: "./extension/popup/popup.es6.js"
    },
    output: {
        path: path.resolve(__dirname, "extension/popup/"),
        filename: "./[name].js"
    },
}

options_config = {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
        minimize: false
    },
    entry: {
        options: "./extension/options/options.es6.js"
    },
    output: {
        path: path.resolve(__dirname, "extension/options/"),
        filename: "./[name].js"
    },
}

devtools_config = {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
        minimize: false
    },
    entry: {
        devtools_panel: "./extension/devtools/panel/devtools_panel.es6.js"
    },
    output: {
        path: path.resolve(__dirname, "extension/devtools/panel/"),
        filename: "./[name].js"
    },
}

extension_config = {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
        minimize: false
    },
    entry: {
        index: "./extension/js/background.es6.js",
    },
    output: {
        path: path.resolve(__dirname, "extension/js/"),
        filename: "./[name].js"
    },
    plugins: [
         new CopyWebpackPlugin([
             {
                 from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js', to: './'
             }
         ])
     ]
}

module.exports = [extension_config, devtools_config, popup_config, options_config];


