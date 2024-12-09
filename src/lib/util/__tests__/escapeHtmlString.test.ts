import { escapeHtmlString } from '$lib/util/escapeHtmlString';

describe('escapeHtmlString', () => {
	// Basic functionality tests
	it('escapes & to &amp;', () => {
		expect(escapeHtmlString('&')).toBe('&amp;');
	});

	it('escapes < to &lt;', () => {
		expect(escapeHtmlString('<')).toBe('&lt;');
	});

	it('escapes > to &gt;', () => {
		expect(escapeHtmlString('>')).toBe('&gt;');
	});

	it('escapes " to &quot;', () => {
		expect(escapeHtmlString('"')).toBe('&quot;');
	});

	it("escapes ' to &apos;", () => {
		expect(escapeHtmlString("'")).toBe('&apos;');
	});

	it('escapes multiple special characters in a string', () => {
		expect(escapeHtmlString('Tom & Jerry <Cartoons> "Funny"')).toBe(
			'Tom &amp; Jerry &lt;Cartoons&gt; &quot;Funny&quot;'
		);
	});

	it('returns the original string if no special characters are present', () => {
		expect(escapeHtmlString('Hello, World!')).toBe('Hello, World!');
	});

	it('handles an empty string', () => {
		expect(escapeHtmlString('')).toBe('');
	});

	// Complex test case
	it('escapes all special characters in a complex string', () => {
		const input = `Tom & Jerry's "Adventure" <in> the 'Wild' & mysterious world of <HTML>`;
		const expected = `Tom &amp; Jerry&apos;s &quot;Adventure&quot; &lt;in&gt; the &apos;Wild&apos; &amp; mysterious world of &lt;HTML&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	// Dangerous edge cases
	it('escapes a script tag to prevent XSS', () => {
		const input = `<script>alert('XSS')</script>`;
		const expected = `&lt;script&gt;alert(&apos;XSS&apos;)&lt;/script&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes an onclick attribute to prevent XSS', () => {
		const input = `<div onclick="alert('XSS')">Click me</div>`;
		const expected = `&lt;div onclick=&quot;alert(&apos;XSS&apos;)&quot;&gt;Click me&lt;/div&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes an img tag with an onerror attribute to prevent XSS', () => {
		const input = `<img src="invalid.jpg" onerror="alert('XSS')" />`;
		const expected = `&lt;img src=&quot;invalid.jpg&quot; onerror=&quot;alert(&apos;XSS&apos;)&quot; /&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes a mix of script tags and HTML', () => {
		const input = `<b>Hello</b><script>alert('XSS')</script>`;
		const expected = `&lt;b&gt;Hello&lt;/b&gt;&lt;script&gt;alert(&apos;XSS&apos;)&lt;/script&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	// OWASP vulnerabilities
	it('escapes a SQL injection-like string', () => {
		const input = `SELECT * FROM users WHERE name = 'admin' --`;
		const expected = `SELECT * FROM users WHERE name = &apos;admin&apos; --`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes an XSS attempt with event handlers', () => {
		const input = `<button onmouseover="alert('XSS')">Hover me</button>`;
		const expected = `&lt;button onmouseover=&quot;alert(&apos;XSS&apos;)&quot;&gt;Hover me&lt;/button&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes an inline JavaScript attempt', () => {
		const input = `<img src="javascript:alert('XSS')" />`;
		const expected = `&lt;img src=&quot;javascript:alert(&apos;XSS&apos;)&quot; /&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes a string with mixed HTML and text', () => {
		const input = `<h1>Welcome</h1><p>This is a <strong>test</strong></p>`;
		const expected = `&lt;h1&gt;Welcome&lt;/h1&gt;&lt;p&gt;This is a &lt;strong&gt;test&lt;/strong&gt;&lt;/p&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes a string that tries to manipulate the DOM', () => {
		const input = `<div id="test" onclick="document.location='http://evil.com'">Click me</div>`;
		const expected = `&lt;div id=&quot;test&quot; onclick=&quot;document.location=&apos;http://evil.com&apos;&quot;&gt;Click me&lt;/div&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes dangerous attributes like style with JavaScript', () => {
		const input = `<div style="background-image: url('javascript:alert(1)')">Content</div>`;
		const expected = `&lt;div style=&quot;background-image: url(&apos;javascript:alert(1)&apos;)&quot;&gt;Content&lt;/div&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});

	it('escapes a complex combination of threats', () => {
		const input = `<script>alert('XSS')</script><img src="javascript:alert('XSS')" onerror="alert('XSS')"><div style="background-image: url('javascript:alert(1)')"></div>`;
		const expected = `&lt;script&gt;alert(&apos;XSS&apos;)&lt;/script&gt;&lt;img src=&quot;javascript:alert(&apos;XSS&apos;)&quot; onerror=&quot;alert(&apos;XSS&apos;)&quot;&gt;&lt;div style=&quot;background-image: url(&apos;javascript:alert(1)&apos;)&quot;&gt;&lt;/div&gt;`;
		expect(escapeHtmlString(input)).toBe(expected);
	});
});
