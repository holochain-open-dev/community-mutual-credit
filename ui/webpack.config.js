const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BaseHrefWebpackPlugin } = require("base-href-webpack-plugin");

module.exports = {
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "dist-pages"),
  },
  resolve: {
    alias: {
      "lit-element": path.resolve("./node_modules/lit-element"),
      "lit-html": path.resolve("./node_modules/lit-html"),
      "wicg-inert": path.resolve("./node_modules/wicg-inert/dist/inert"),
    },
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss", ".html"],
  },
  entry: ["babel-polyfill", "./src/index.ts"],
  devServer: {
    historyApiFallback: true,
    port: 8000,
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: { ie: "11" } }]],
            plugins: ["@babel/plugin-syntax-dynamic-import"],
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new BaseHrefWebpackPlugin({
      baseHref:
        !process.env.NODE_ENV || process.env.NODE_ENV == "development"
          ? "/"
          : "/holochain-playground/",
    }),
  ],
};
