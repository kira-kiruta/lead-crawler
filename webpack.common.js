const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const distPath = path.resolve(__dirname, 'extension/dist');

module.exports = {
  entry: {
    popup: './src/popup/popup.js',
    content: './src/content/content.js',
    background: './src/background/background.js'
  },
  output: {
    filename: '[name].js',
    path: distPath,
  },
  module: {
    rules: [
      {
        test: /\.(ttf)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            name: './fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(distPath),
  ]
};
