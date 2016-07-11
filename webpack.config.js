var webpack = require("webpack");
var path = require('path');

module.exports = [
  // Main bundle
  {
    context: path.resolve(__dirname, 'komodo'),
    entry: {
      bundle: "./server/src/main.js"
    },
    output: {
      filename: "[name].js",
      path: "komodo/server/static",
      library: "komodo",
      publicPath: "/static"
    },
    module: {
      loaders: [
        {
          loader: "babel",
          test: /\.jsx?$/,
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
    context: path.resolve(__dirname, 'komodo'),
    entry: {
      Number: "./widgets/src/Number.jsx",
      StatusList: "./widgets/src/StatusList.jsx",
      Graph: "./widgets/src/Graph.jsx",
      Gauge: "./widgets/src/Gauge.jsx",
      TimeSince: "./widgets/src/TimeSince.jsx",
      Countdown: "./widgets/src/Countdown.jsx",
    },
    output: {
      filename: "[name].js",
      path: "komodo/widgets/bundles",
      library: "widget_[name]",
      publicPath: "/static"
    },
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loader: "babel",
          test: /\.jsx?$/,
        },
        {
          exclude: /node_modules/,
          test: /\.css$/,
          loader: "style!css?modules"
        },
      ]
    },
    externals: {
      'komodo': 'komodo',
      'react': "komodo.React",
      'react-dom': 'komodo.ReactDOM',
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ]
  }
];
