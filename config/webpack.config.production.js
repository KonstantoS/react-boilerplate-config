const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = require('./paths');

const cssOutputPath = name => path.join('css', `${name}.[hash].css`);

const extractCSS = new ExtractTextPlugin(cssOutputPath('vendor'));
const extractSCSS = new ExtractTextPlugin(cssOutputPath('main'));

module.exports = {
  mode: 'production',
  entry: {
    main: ['@babel/polyfill', paths.entryPoint],
  },
  output: {
    path: paths.outputPath,
    publicPath: '/',
    filename: path.join('js', '[name].[chunkhash].js'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [paths.nodeModules, paths.src],
    alias: {
      config: paths.appConfig,
      static: paths.publicFiles,
      public: paths.publicFiles,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        loader: extractSCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                namedExport: true,
                localIdentName: '[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [autoprefixer],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [paths.sass],
              },
            },
          ],
        }),
      },
      {
        test: /\.svg$/,
        exclude: [paths.publicFiles],
        loader: 'svg-sprite-loader',
      },
      {
        include: [paths.publicFiles],
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    extractCSS,
    extractSCSS,
    new HtmlWebpackPlugin({
      template: path.join(paths.publicFiles, 'index.html'),
      minify: {
        collapseWhitespace: true,
      },
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new UglifyJsPlugin(),
  ],
};
