const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    port: 9000,
    inline: true,
    overlay: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'less-loader'],
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: path.posix.join('', 'img/[name].[hash:7].[ext]')
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.less']
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      // hash: true
    })
  ],
}