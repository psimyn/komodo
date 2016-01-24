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
      library: "Dashmat",
      publicPath: "/static"
    },
    module: {
      loaders: [
        {
          loader: "babel",
          test: /\.jsx?$/,
          query: {
            presets: ["react", "es2015"]
          }
        },
        {
          test: /\.css$/,
          loader: "style!css?modules"
        },
        {
          test: /\.svg$/,
          loader: 'svg-inline'
        },
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
      StatusList: "./widgets/src/StatusList.jsx",
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
        },
      ]
    },
    externals: {
      'Dashmat': 'Dashmat',
      'react': "Dashmat.React",
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
  }
];
