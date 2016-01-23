var webpack = require("webpack");
var path = require('path');

module.exports = [
  // Main bundle
  {
    context: path.resolve('dashmat'),
    entry: {
      bundle: "./server/src/main.js"
    },
    output: {
      filename: "[name].js",
      path: "dashmat/server/static",
      library: "Dashing",
      publicPath: "/static"
    },
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: "babel",
          test: /\.jsx?$/,
          query: {
            presets: ["react", "es2015"]
          }
        },
        {
          test: /\.css$/,
          loader: "style!css?modules"
        }
      ]
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
  },
  // Widget builds
  {
    context: path.resolve('dashmat'),
    entry: {
      Number: "./widgets/src/Number.jsx",
    },
    output: {
      filename: "[name].js",
      path: "dashmat/widgets/bundles",
      library: "widget_[name]",
      publicPath: "/static"
    },
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: "babel",
          test: /\.jsx?$/,
          query: {
            presets: ["react", "es2015"]
          }
        },
        {
          test: /\.css$/,
          loader: "style!css?modules"
        }
      ]
    },
    externals: {
      'Dashing': 'Dashing',
      'react': "Dashing.React",
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
  }
];
