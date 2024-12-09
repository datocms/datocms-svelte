import { headTagsToEscapedStrings, type GenericHeadTag } from '$lib/util/headTagToEscapedStrings';

const metaTagsSample: GenericHeadTag[] = [
	{
		tag: 'meta',
		attributes: { charset: 'UTF-8' }
	},
	{
		tag: 'meta',
		attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1' }
	},
	{
		tag: 'link',
		attributes: { rel: 'stylesheet', href: '/styles.css' }
	},
	{
		tag: 'script',
		content: 'console.log("Hello");'
	}
];

describe('headTagsToEscapedStrings - simple tests', () => {
	it('returns an empty array for empty input', () => {
		const result = headTagsToEscapedStrings([]);
		expect(result).toEqual([]);
	});

	it('handles meta tags with attributes', () => {
		const result = headTagsToEscapedStrings([{ tag: 'meta', attributes: { charset: 'UTF-8' } }]);
		expect(result).toEqual(['<meta charset="UTF-8"/>']);
	});

	it('handles tags with multiple attributes', () => {
		const result = headTagsToEscapedStrings([
			{
				tag: 'meta',
				attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1' }
			}
		]);
		expect(result).toEqual([
			'<meta name="viewport" content="width=device-width, initial-scale=1"/>'
		]);
	});

	it('handles tags without attributes or content', () => {
		const result = headTagsToEscapedStrings([{ tag: 'meta' }]);
		expect(result).toEqual(['<meta/>']);
	});

	it('escapes attributes correctly', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { name: '<test>', content: '"quoted"' } }
		]);
		expect(result).toEqual(['<meta name="&lt;test&gt;" content="&quot;quoted&quot;"/>']);
	});

	it('skips empty attribute values', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { name: 'test', content: '' } }
		]);
		expect(result).toEqual(['<meta name="test"/>']);
	});

	it('handles tags with content', () => {
		const result = headTagsToEscapedStrings([{ tag: 'script', content: 'console.log("Hello");' }]);
		expect(result).toEqual(['<script>console.log("Hello");</script>']);
	});

	it('processes a mixed list of tags', () => {
		const result = headTagsToEscapedStrings(metaTagsSample);
		expect(result).toEqual([
			'<meta charset="UTF-8"/>',
			'<meta name="viewport" content="width=device-width, initial-scale=1"/>',
			'<link rel="stylesheet" href="/styles.css"/>',
			'<script>console.log("Hello");</script>'
		]);
	});
});

describe('headTagsToEscapedStrings - vulnerability tests', () => {
	it('escapes script injection attempts in attributes', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { name: 'viewport', content: '<script>alert("XSS")</script>' } }
		]);
		expect(result).toEqual([
			'<meta name="viewport" content="&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"/>'
		]);
	});

	it('handles SQL injection payloads in attributes', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { name: 'author', content: '"; DROP TABLE users;--' } }
		]);
		expect(result).toEqual(['<meta name="author" content="&quot;; DROP TABLE users;--"/>']);
	});

	it('handles event handler injection attempts in attributes', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'img', attributes: { src: 'x', onerror: 'alert("XSS")' } }
		]);
		expect(result).toEqual(['<img src="x" onerror="alert(&quot;XSS&quot;)"/>']);
	});

	it('sanitizes special characters in tag attributes', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { name: '<meta>', content: 'content&value"special\'' } }
		]);
		expect(result).toEqual([
			'<meta name="&lt;meta&gt;" content="content&amp;value&quot;special&apos;"/>'
		]);
	});

	it('prevents malformed HTML from breaking the output', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { name: 'test', content: '"></meta><script>alert(1)</script>' } }
		]);
		expect(result).toEqual([
			'<meta name="test" content="&quot;&gt;&lt;/meta&gt;&lt;script&gt;alert(1)&lt;/script&gt;"/>'
		]);
	});

	it('ignores attribute keys with malicious patterns', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { '"><script>alert(1)</script>': 'malicious' } }
		]);
		expect(result).toEqual(['<meta &quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;="malicious"/>']);
	});

	it('prevents double-escaping of HTML entities', () => {
		const result = headTagsToEscapedStrings([
			{ tag: 'meta', attributes: { content: '&lt;already-escaped&gt;' } }
		]);
		expect(result).toEqual(['<meta content="&lt;already-escaped&gt;"/>']);
	});
});
