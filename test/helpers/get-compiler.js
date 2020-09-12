import path from 'path';
import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default (fixture, loaderOptions = {}, config = {}, skipLoader = false) => {
	const loaders = [];

	if (!skipLoader) {
		loaders.push({
				test: path.resolve(__dirname, '../fixtures', fixture),
				use: [{
					loader: path.resolve(__dirname, '../../src'),
					options: loaderOptions
				}]
		});
	}

	const webpackConfig = {
		mode: 'development',
		devtool: config ? config.devtool || false : false,
		context: path.resolve(__dirname, '../fixtures'),
		entry: path.resolve(__dirname, '../fixtures', fixture),
		output: {
			path: path.resolve(__dirname, '../outputs'),
			filename: '[name].bundle.js',
			chunkFilename: '[name].chunk.js',
			library: 'FilteredJSONLoader'
		},
		module: {
			rules: loaders
		},
		plugins: [],
		...config || {}
	};
	const compiler = webpack(webpackConfig);

	if (!config || !config.outputFileSystem) {
		const outputFileSystem = createFsFromVolume(new Volume());

		outputFileSystem.join = path.join.bind(path);

		compiler.outputFileSystem = outputFileSystem;
	}

	return compiler;
};
