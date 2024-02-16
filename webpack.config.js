const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    filename: 'bundle.js', // Output bundle file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Don't apply to files residing in node_modules
        use: {
          loader: 'babel-loader', // Use babel-loader for .js files
          options: {
            presets: ['@babel/preset-env'], // Apply the @babel/preset-env preset
          },
        },
      },
      // Add more rules for handling other file types (e.g., CSS, images) here
    ],
  },
  resolve: {
    extensions: ['.js'], // Resolve .js extensions automatically
  },
  // Add any additional plugins or configurations here
};
