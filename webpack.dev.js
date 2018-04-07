const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devServer: {
      historyApiFallback: true
    },
    devtool: '#eval-source-map'
});
