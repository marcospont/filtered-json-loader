# filtered-json-loader

> The filtered JSON loader allows you to apply filters on contents loaded from JSON files.

> The main benefit of filtering JSON content is to load only the necessary properties, thus producing a smaller output file.

## Install

With [npm](https://npmjs.org/package/filtered-json-loader) do:

```
npm i filtered-json-loader --save-dev
```


## Usage

The loader can receive options from the Webpack configuration object or called using the inline loader syntax.

The options passed to the configuration object or appended in the inline syntax need to contain one or both of these properties:

* accept: a value indicating which properties from the JSON object need to be accepted
* deny: a value indicating which properties from the JSON object need to be denied/excluded

Both 'accept' and 'deny' properties can assume one of the following formats:

* an array of strings - each array element will be matched against the JSON object properties using simple equality (case sensitive)
* a regexp instance - will be matched against the JSON object properties
* a string - will be interpreted as a case insensitive regular expression and matched against all JSON object properties

### Examples of filtered-json-loader inside a Webpack configuration object

```js
{
	module: {
		rules: [
			test: /\.json\,
			use: [{
				loader: 'filtered-json-loader',
				options: {
					accept: /^starts/,
					deny: /ends$/
				}
			}]
		]
	}
}
```

```js
{
	module: {
		rules: [
			test: /\.json\,
			use: [{
				loader: 'filtered-json-loader',
				options: {
					accept: ['prop1', 'prop2'],
					deny: ['prop2']
				}
			}]
		]
	}
}
```

### Examples of filtered-json-loader using inline loader syntax

```js
import jsonObj from 'filtered-json-loader?accept=foo!./my-file.json';
import anotherJsonObj from 'filtered-json-loader?deny=bar!./my-other-file.json';

import jsonObjArr from 'filtered-json-loader?accept[]=foo!./my-file.json';
import anotherJsonObjArr from 'filtered-json-loader?deny[]=bar!./my-other-file.json';
```

## Example

### Config

```js
{
	accept: ['foo']
}
```

### Input

```json
{
	"foo": 1,
	"bar": 2
}
```

### Output

```json
{
	"foo": 1
}
```


## Contributing

Feel free to submit pull requests. When adding anything new, please remember to update the tests file.


## License

MIT © [Marcos Pont](https://github.com/marcospont)
