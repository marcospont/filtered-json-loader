import { getCompiler, compile, extractErrors, getSource } from './helpers';

describe('Filtered JSON Loader', () => {
	it('options should be an object', async() => {
		let compiler = null;

		expect(() => {
			compiler = getCompiler('sample1.json', false);
		}).toThrow('configuration.module.rules[0].use should be one of these');
	});
	it('options should contain the accept and/or the deny properties', async() => {
		const compiler = getCompiler('sample1.json', {});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('options should be one of these');
		expect(errors[0].error.message).toMatch('object { accept, … } | object { deny, … }');
    });
	it('options should not contain unknown properties', async() => {
		const compiler = getCompiler('sample1.json', {
            unknown: true
        });
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch("options has an unknown property 'unknown'");
	});
	it('the accept property should be an array or a regexp', async() => {
		const compiler = getCompiler('sample1.json', {
            accept: true
        });
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('options.accept should be one of these');
	});
	it('when the accept property is an array, it should be an array of strings', async() => {
		const compiler = getCompiler('sample1.json', {
            accept: [false]
        });
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('options.accept[0] should be a non-empty string');
	});
	it('when the accept property is an array, it should be an array of non empty strings', async() => {
		const compiler = getCompiler('sample1.json', {
            accept: ['']
        });
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('options.accept[0] should be an non-empty string');
	});
	it('the deny property should be an array or a regexp', async() => {
		const compiler = getCompiler('sample1.json', {
            deny: true
        });
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('options.deny should be one of these');
	});
	it('when the deny property is an array, it should be an array of strings', async() => {
		const compiler = getCompiler('sample1.json', {
            deny: [false]
        });
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('options.deny[0] should be a non-empty string');
	});
	it('when the deny property is an array, it should be an array of non empty strings', async() => {
		const compiler = getCompiler('sample1.json', {
            deny: ['']
        });
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('options.deny[0] should be an non-empty string');
	});
	it('should throw an error when loading invalid JSON', async() => {
		const compiler = getCompiler('sample2.txt', {
			accept: ['foo']
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('Parsed source is not a valid JSON string');
	});
	it('should throw an error when parsed JSON is not an object', async() => {
		const compiler = getCompiler('sample3.json', {
			accept: ['foo']
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch('Parsed JSON content is not a plain object');
	});
	it('should filter JSON content using the accept property as a regexp', async() => {
		const compiler = getCompiler('sample1.json', {
			accept: /foo/
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);
		const source = getSource('./sample1.json', stats);
		const json = JSON.parse(source);

		expect(errors).toHaveLength(0);
		expect(json).toHaveProperty('foo');
		expect(json).not.toHaveProperty('bar');
	});
	it('should filter JSON content using the accept property as an array', async() => {
		const compiler = getCompiler('sample1.json', {
			accept: ['foo']
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);
		const source = getSource('./sample1.json', stats);
		const json = JSON.parse(source);

		expect(errors).toHaveLength(0);
		expect(json).toHaveProperty('foo');
		expect(json).not.toHaveProperty('bar');
	});
	it('should filter JSON content using the deny property as a regexp', async() => {
		const compiler = getCompiler('sample1.json', {
			deny: /foo/
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);
		const source = getSource('./sample1.json', stats);
		const json = JSON.parse(source);

		expect(errors).toHaveLength(0);
		expect(json).toHaveProperty('bar');
		expect(json).not.toHaveProperty('foo');
	});
	it('should filter JSON content using the deny property as an array', async() => {
		const compiler = getCompiler('sample1.json', {
			deny: ['foo']
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);
		const source = getSource('./sample1.json', stats);
		const json = JSON.parse(source);

		expect(errors).toHaveLength(0);
		expect(json).toHaveProperty('bar');
		expect(json).not.toHaveProperty('foo');
	});
	it('should filter JSON content using both accept and deny properties as regexp', async() => {
		const compiler = getCompiler('sample1.json', {
			accept: /\w+/,
			deny: /foo/
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);
		const source = getSource('./sample1.json', stats);
		const json = JSON.parse(source);

		expect(errors).toHaveLength(0);
		expect(json).toHaveProperty('bar');
		expect(json).not.toHaveProperty('foo');
	});
	it('should filter JSON content using both accept and deny properties as arrays', async() => {
		const compiler = getCompiler('sample1.json', {
			accept: ['foo', 'bar'],
			deny: ['bar']
		});
		const stats = await compile(compiler);
		const errors = extractErrors(stats);
		const source = getSource('./sample1.json', stats);
		const json = JSON.parse(source);

		expect(errors).toHaveLength(0);
		expect(json).toHaveProperty('foo');
		expect(json).not.toHaveProperty('bar');
	});
	it('should work with loader inline syntax', async() => {
		const compiler = getCompiler('inline.js', null, null, true);
		const stats = await compile(compiler);
		const errors = extractErrors(stats);
		const source = getSource('./sample1.json', stats);
		const json = JSON.parse(source);

		expect(errors).toHaveLength(0);
		expect(json).toHaveProperty('foo');
		expect(json).not.toHaveProperty('bar');
	});
	it('should throw an error when the inline laoder syntax is malformed', async() => {
		const compiler = getCompiler('inline-error.js', null, null, true);
		const stats = await compile(compiler);
		const errors = extractErrors(stats);

        expect(errors).toHaveLength(1);
		expect(errors[0].name).toBe('ModuleBuildError');
		expect(errors[0].error.message).toMatch("options has an unknown property 'unknown'");
	});
});