const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    vender: path.resolve(__dirname, '../src/vender.js'),
    main: path.resolve(__dirname, '../src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    publicPath: 'file:///E:/mywork/project/travelclover/dist/'
    // publicPath: 'https://www.notehut.cn/'
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
  externals: {
    jquery: 'jQuery',
    swiper: 'Swiper'
  },
  resolve: {
    extensions: ['.js', '.less']
  },
  plugins: [
    new cleanWebpackPlugin(['dist/*'], {
      root: path.resolve(__dirname, '../')
    }),
    new ExtractTextPlugin({
      filename: path.posix.join('', 'css/[name].[hash].css')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      // hash: true
    }),
    new CopyWebpackPlugin([
      {
        from: 'lib/jquery-1.10.1.min.js',
        to: 'js/jquery-1.10.1.min.js'
      },
      {
        from: 'lib/swiper-4.1.6.min.js',
        to: 'js/swiper-4.1.6.min.js'
      },
      {
        from: 'lib/swiper.animate1.0.3.min.js',
        to: 'js/swiper.animate1.0.3.min.js'
      },
      {
        from: 'lib/normalize.css',
        to: 'css/normalize.css'
      },
      {
        from: 'lib/swiper-4.1.6.min.css',
        to: 'css/swiper-4.1.6.min.css'
      },
      {
        from: 'lib/animate.min.css',
        to: 'css/animate.min.css'
      },
    ])
  ],
}