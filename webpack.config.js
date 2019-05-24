const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'development';
module.exports = {
  entry: {
    app:path.resolve(__dirname,'example/index.js'),
   // app:'./src/js/barrage.ts'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    //libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './tsconfig.json')
            },
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    contentBase: './dist',
    host:'0.0.0.0'
  },
  plugins: [
    //new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body',
    }),
    
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ],
};
