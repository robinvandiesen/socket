const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
	entry: './src/',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/demos', to: 'demos' },
    ])
  ]
}

module.exports = config;
