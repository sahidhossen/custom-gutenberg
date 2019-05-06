/**
 * Minimum webpack Config for WordPress Block Plugin
 *
 * webpack basics — If you are new the webpack here's all you need to know:
 *     1. webpack is a module bundler. It bundles different JS modules together.
 *     2. webpack needs and entry point and an ouput to process file(s) and bundle them.
 *     3. By default webpack only understands JavaScript but Loaders enable webpack to
 *        process more than just JavaScript files.
 *     4. In the file below you will find an entry point, an ouput, and a babel-loader
 *        that tests all .js files excluding the ones in node_modules to process the
 *        modern JavaScript and make it compatible with older browsers i.e. it converts the
 *        code written witten with modern JavaScript (new standards of JavaScript) into old
 *        JavaScript through a Babel loader.
 *
 * Instructions: How to build or develop with this Webpack config:
 *     1. In the command line browse the folder `02-basic-esnext` where
 *        this `webpack.config.js` file is present.
 *     2. Run the `npm run dev` or `npm run build` for development or
 *        production respectively.
 *     3. To read what these NPM Scripts do, read the `package.json` file.
 *
 * @link webpack https://webpack.js.org/
 * @link webpack concepts https://webpack.js.org/concepts/
 * @author Ahmad Awais https://github.com/ahmadawais
 * @since 1.0.0
 */
const webpack = require("webpack");
const paths = require( './config' );
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackRTLPlugin = require("webpack-rtl-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

// Enviornment Flag
const inProduction = "production" === process.env.NODE_ENV;

 
// Block CSS loader
const cssExtractTextPlugin = new ExtractTextPlugin({
  filename: "./build/gutenberg.css"
});

const copyTinyMCEPlugin = new CopyWebpackPlugin([
  { from: 'node_modules/tinymce/plugins', to: `${ paths.pluginBuild }/build/plugins` },
  { from: 'node_modules/tinymce/themes', to: `${ paths.pluginBuild }/build/themes` },
  { from: 'node_modules/tinymce/skins', to: `${ paths.pluginBuild }/build/skins` },
], {})

// Configuration for the ExtractTextPlugin.
// const extractConfig = {
//   use: [
//     { loader: "raw-loader" },
//     {
//       loader: "postcss-loader",
//       options: {
//         plugins: [require("autoprefixer")]
//       }
//     },
//     {
//       loader: "sass-loader",
//       options: {
//         outputStyle: 'nested',
//       }
//     }
//   ]
// };

// Configuration for the ExtractTextPlugin — DRY rule.
const extractConfig = {
	use: [
		// "postcss" loader applies autoprefixer to our CSS.
		{ loader: 'raw-loader' },
		{
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				plugins: [
					autoprefixer( {
						browsers: [
							'>1%',
							'last 4 versions',
							'Firefox ESR',
							'not ie < 9', // React doesn't support IE8 anyway
						],
						flexbox: 'no-2009',
					} ),
				],
			},
		},
		// "sass" loader converts SCSS to CSS.
		{
			loader: 'sass-loader',
			options: {
				// Add common CSS file for variables and mixins.
				outputStyle: 'nested',
			},
		},
	],
};


const config = {
  // Entry.
  entry: {
    './build/gutenberg.main': paths.pluginBlocksJs, 
  }, 

  // Output.
  output: {
    pathinfo: true,
    path: paths.pluginBuild, // Path to produce the output. Set to the current directory.
    //filename: "./build/block.build.js", // Filename of the file that webpack builds.
    library: ["joomlagutenberg", "[name]"],
    filename: '[name].js'
  },
  // devtool: 'cheap-eval-source-map',
  // Loaders.
  // The configuration below has defined a rules property for a single module with
  // two required properties: test and use. This tells webpack's compiler the following:
  // "Hey webpack compiler, when you come across a '.js' or '.jsx' file inside of a
  // require()/import statement, use the babel-loader to transform it before you add
  // it to the bundle."
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Identifies which file or files should be transformed.
        use: { loader: "babel-loader" }, // Babel loader to transpile modern JavaScript.
        exclude: /(node_modules|bower_components)/ // JavaScript files to be ignored.
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s?css$/,
        exclude: /(node_modules|bower_components)/,
        use: cssExtractTextPlugin.extract(extractConfig)
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["build"]),
    cssExtractTextPlugin,
    new WebpackRTLPlugin(),
    copyTinyMCEPlugin
  ]
};


// For Productions
if (inProduction) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ sourceMap: false }));
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: false }));
}

module.exports = config