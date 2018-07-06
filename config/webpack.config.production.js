const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const paths = require('./paths');

const cssOutputPath = name => path.join('css', `${name}.[hash].css`);

const extractCSS = new ExtractTextPlugin(cssOutputPath('vendor'));
const extractSCSS = new ExtractTextPlugin(cssOutputPath('main'));

module.exports = {
  mode: 'production',
  entry: {
    main: paths.entryPoint,
    core: ['@babel/polyfill', 'react', 'react-dom', 'react-router-dom'],
  },
  output: {
    path: paths.outputPath,
    publicPath: '/',
    filename: path.join('js', '[name].[chunkhash].js'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        core: {
          test: /[\\/]node_modules[\\/]/,
          name: 'core',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
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
                includePaths: [paths.sсss],
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
        exclude: [path.join(paths.publicFiles, 'index.html')],
        loader: 'file-loader',
      },
    ],
  },
  plugins: (() => {
    const plugins = [
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
    ];
    if (process.argv.includes('--analyze')) {
      plugins.push(new BundleAnalyzerPlugin());
    }
    return plugins;
  })(),
};
