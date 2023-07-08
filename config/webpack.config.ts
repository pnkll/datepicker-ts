const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, options) => {
  const { mode } = options;

  const isDev = mode === 'development';

  const config = {
    mode,
    entry: {
      app: path.resolve(__dirname, '..', 'src', 'index.tsx'),
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '..', 'dist'),
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        name: 'datepicker-ts',
        template: path.resolve(__dirname, '..', 'public', 'index.html'),
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                  exportLocalsConvention: 'camelCase',
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      preferAbsolute: true,
      modules: ['node_modules'],
    },
    devServer: {
      port: 3020,
      historyApiFallback: true,
      allowedHosts: 'all',
    },
    devtool: 'inline-source-map',
  };

  return config;
};
