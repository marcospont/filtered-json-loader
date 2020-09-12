import isUndefined from 'lodash/isUndefined';

export default (stats) => {
	return !isUndefined(stats) && !isUndefined(stats.compilation) ? stats.compilation.errors || [] : [];
};