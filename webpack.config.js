const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"]
  },
  entry: "./src/main.ts",
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  devtool: isProduction ? '' : 'inline-cheap-source-map',
  devServer: {
    open: true,
    // openPage: "index.html",
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    port: 1234
  }
};