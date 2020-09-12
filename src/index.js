import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import isPlainObject from 'lodash/isPlainObject';
import isUndefined from 'lodash/isUndefined';

import schema from './options.json';

export default function loader(source) {
	const options = getOptions(this);

	validateOptions(schema, options, {
		name: "Filtered JSON Loader",
		baseDataPath: "options"
	});

	const callback = this.async();
	const { accept, deny } = options;
	let jsonObj = null;

	try {
		jsonObj = JSON.parse(source);
	} catch (error) {
		callback(new Error('Parsed source is not a valid JSON string'));
		return;
	}

	if (!isPlainObject(jsonObj)) {
		callback(new Error('Parsed JSON content is not a plain object'));
		return;
	}

	if (deny) {
		if (Array.isArray(deny)) {
			deny.forEach(prop => {
				if (!isUndefined(jsonObj[prop])) {
					delete jsonObj[prop];
				}
			});
		} else if (typeof deny === 'string') {
			const regExp = new RegExp(deny, 'i');

			Object.keys(jsonObj).forEach(prop => {
				if (regExp.test(prop)) {
					delete jsonObj[prop];
				}
			});
		} else {
			Object.keys(jsonObj).forEach(prop => {
				if (deny.test(prop)) {
					delete jsonObj[prop];
				}
			});
		}
	}

	if (accept) {
		if (Array.isArray(accept)) {
			Object.keys(jsonObj).forEach(prop => {
				if (!accept.includes(prop)) {
					delete jsonObj[prop];
				}
			});
		} else if (typeof accept === 'string') {
			const regExp = new RegExp(accept, 'i');

			Object.keys(jsonObj).forEach(prop => {
				if (!regExp.test(prop)) {
					delete jsonObj[prop];
				}
			});
		} else {
			Object.keys(jsonObj).forEach(prop => {
				if (!accept.test(prop)) {
					delete jsonObj[prop];
				}
			});
		}
	}

	callback(null, `${JSON.stringify(jsonObj)}`);
};