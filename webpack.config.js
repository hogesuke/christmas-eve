const path = require('path');

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
  devServer: {
    open: true,
    // openPage: "index.html",
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    port: 1234
  }
};