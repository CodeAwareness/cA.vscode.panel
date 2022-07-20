const path = require('path')
const preprocess = require('svelte-preprocess')
const webpack = require('webpack')

const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { WebpackPluginServe } = require('webpack-plugin-serve')
const DotenvPlugin = require('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackBar = require('webpackbar')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

exports.analyze = () => ({
  plugins: [
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
    }),
  ],
})

// clean dist directory on build
exports.cleanDist = () => ({
  plugins: [new CleanWebpackPlugin()],
})

// show a nice progress bar in the terminal
exports.useWebpackBar = () => ({
  plugins: [new WebpackBar()],
})

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: 3080,
      host: '0.0.0.0',
      static: path.resolve(process.cwd(), 'dist'),
      historyFallback: true,
    }),
  ],
})

exports.optimize = () => ({
  optimization: {
    minimize: true,
    splitChunks: { chunks: 'all' },
    runtimeChunk: { name: 'runtime' },
    minimizer: ['...', new CssMinimizerPlugin()],
  },
})

exports.page = ({ title }) => ({
  plugins: [new MiniHtmlWebpackPlugin({ publicPath: '/', context: { title } })],
})

exports.generateSourceMaps = ({ type }) => ({ devtool: type })

exports.postcss = () => ({
  loader: 'postcss-loader',
})

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.(p?css)$/,
          use: [{ loader: MiniCssExtractPlugin.loader, options }, 'css-loader'].concat(
            loaders,
          ),
          sideEffects: true,
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: "static/[hash][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
  }
}

exports.typescript = () => {
  console.log('TYPESCRIPT:', path.resolve(__dirname, '../src'))
  return {
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
      ],
    },
  }
}

exports.loadSvg = () => ({
  module: { rules: [{ test: /\.svg$/, type: 'asset' }] },
})

exports.useDotenv = (mode) => ({
  plugins: [
    new DotenvPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(mode === 'production'),
    }),
  ],
})

exports.svelte = mode => {
  const prod = mode === 'production'
  console.log('SVELTE', mode, path.resolve(__dirname, '../src'))

  return {
    resolve: {
      alias: {
        svelte: path.dirname(require.resolve('svelte/package.json')),
        '@': path.resolve(__dirname, '../src'),
      },
      extensions: ['.mjs', '.js', '.svelte', '.ts'],
      mainFields: ['svelte', 'browser', 'module', 'main'],
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                dev: !prod,
              },
              emitCss: prod,
              hotReload: !prod,
              preprocess: preprocess({
                postcss: true,
              }),
            },
          },
        },
        {
          test: /node_modules\/svelte\/.*\.mjs$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
  }
}

exports.esbuild = () => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'esbuild-loader',
          options: {
            target: 'es2015',
          },
        },
        {
          test: /\.ts$/,
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'es2015',
          },
        },
      ],
    },
  }
}
