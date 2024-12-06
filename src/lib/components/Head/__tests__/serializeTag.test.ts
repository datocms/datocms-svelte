import type { GenericTag } from "../Head.svelte";
import { escapeHtml, serializeTag } from "../serializeTag";

describe("escapeHtml", () => {
	// Basic functionality tests
	it("escapes & to &amp;", () => {
		expect(escapeHtml("&")).toBe("&amp;");
	});

	it("escapes < to &lt;", () => {
		expect(escapeHtml("<")).toBe("&lt;");
	});

	it("escapes > to &gt;", () => {
		expect(escapeHtml(">")).toBe("&gt;");
	});

	it('escapes " to &quot;', () => {
		expect(escapeHtml('"')).toBe("&quot;");
	});

	it("escapes ' to &#39;", () => {
		expect(escapeHtml("'")).toBe("&#39;");
	});

	it("escapes multiple special characters in a string", () => {
		expect(escapeHtml('Tom & Jerry <Cartoons> "Funny"')).toBe(
			"Tom &amp; Jerry &lt;Cartoons&gt; &quot;Funny&quot;",
		);
	});

	it("returns the original string if no special characters are present", () => {
		expect(escapeHtml("Hello, World!")).toBe("Hello, World!");
	});

	it("handles an empty string", () => {
		expect(escapeHtml("")).toBe("");
	});

	// Complex test case
	it("escapes all special characters in a complex string", () => {
		const input = `Tom & Jerry's "Adventure" <in> the 'Wild' & mysterious world of <HTML>`;
		const expected = `Tom &amp; Jerry&#39;s &quot;Adventure&quot; &lt;in&gt; the &#39;Wild&#39; &amp; mysterious world of &lt;HTML&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	// Dangerous edge cases
	it("escapes a script tag to prevent XSS", () => {
		const input = `<script>alert('XSS')</script>`;
		const expected = `&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes an onclick attribute to prevent XSS", () => {
		const input = `<div onclick="alert('XSS')">Click me</div>`;
		const expected = `&lt;div onclick=&quot;alert(&#39;XSS&#39;)&quot;&gt;Click me&lt;/div&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes an img tag with an onerror attribute to prevent XSS", () => {
		const input = `<img src="invalid.jpg" onerror="alert('XSS')" />`;
		const expected = `&lt;img src=&quot;invalid.jpg&quot; onerror=&quot;alert(&#39;XSS&#39;)&quot; /&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes a mix of script tags and HTML", () => {
		const input = `<b>Hello</b><script>alert('XSS')</script>`;
		const expected = `&lt;b&gt;Hello&lt;/b&gt;&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	// OWASP vulnerabilities
	it("escapes a SQL injection-like string", () => {
		const input = `SELECT * FROM users WHERE name = 'admin' --`;
		const expected = `SELECT * FROM users WHERE name = &#39;admin&#39; --`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes an XSS attempt with event handlers", () => {
		const input = `<button onmouseover="alert('XSS')">Hover me</button>`;
		const expected = `&lt;button onmouseover=&quot;alert(&#39;XSS&#39;)&quot;&gt;Hover me&lt;/button&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes an inline JavaScript attempt", () => {
		const input = `<img src="javascript:alert('XSS')" />`;
		const expected = `&lt;img src=&quot;javascript:alert(&#39;XSS&#39;)&quot; /&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes a string with mixed HTML and text", () => {
		const input = `<h1>Welcome</h1><p>This is a <strong>test</strong></p>`;
		const expected = `&lt;h1&gt;Welcome&lt;/h1&gt;&lt;p&gt;This is a &lt;strong&gt;test&lt;/strong&gt;&lt;/p&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes a string that tries to manipulate the DOM", () => {
		const input = `<div id="test" onclick="document.location='http://evil.com'">Click me</div>`;
		const expected = `&lt;div id=&quot;test&quot; onclick=&quot;document.location=&#39;http://evil.com&#39;&quot;&gt;Click me&lt;/div&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes dangerous attributes like style with JavaScript", () => {
		const input = `<div style="background-image: url('javascript:alert(1)')">Content</div>`;
		const expected = `&lt;div style=&quot;background-image: url(&#39;javascript:alert(1)&#39;)&quot;&gt;Content&lt;/div&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});

	it("escapes a complex combination of threats", () => {
		const input = `<script>alert('XSS')</script><img src="javascript:alert('XSS')" onerror="alert('XSS')"><div style="background-image: url('javascript:alert(1)')"></div>`;
		const expected = `&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;&lt;img src=&quot;javascript:alert(&#39;XSS&#39;)&quot; onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;&lt;div style=&quot;background-image: url(&#39;javascript:alert(1)&#39;)&quot;&gt;&lt;/div&gt;`;
		expect(escapeHtml(input)).toBe(expected);
	});
});

const metaTagsSample: GenericTag[] = [
	{
		tag: "meta",
		attributes: { charset: "UTF-8" },
	},
	{
		tag: "meta",
		attributes: {
			name: "viewport",
			content: "width=device-width, initial-scale=1",
		},
	},
	{
		tag: "link",
		attributes: { rel: "stylesheet", href: "/styles.css" },
	},
	{
		tag: "script",
		content: 'console.log("Hello");',
	},
];

describe("serializeTag - simple tests", () => {
	it("handles meta tags with attributes", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: { charset: "UTF-8" },
		});
		expect(result).toEqual('<meta charset="UTF-8"/>');
	});

	it("handles tags with multiple attributes", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: {
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
		});
		expect(result).toEqual(
			'<meta name="viewport" content="width=device-width, initial-scale=1"/>',
		);
	});

	it("handles tags without attributes or content", () => {
		const result = serializeTag({ tag: "meta" });
		expect(result).toEqual("<meta/>");
	});

	it("escapes attributes correctly", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: { name: "<test>", content: '"quoted"' },
		});
		expect(result).toEqual(
			'<meta name="&lt;test&gt;" content="&quot;quoted&quot;"/>',
		);
	});

	it("skips empty attribute values", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: { name: "test", content: "" },
		});
		expect(result).toEqual('<meta name="test"/>');
	});

	it("handles tags with content", () => {
		const result = serializeTag({
			tag: "script",
			content: 'console.log("Hello");',
		});
		expect(result).toEqual('<script>console.log("Hello");</script>');
	});
});

describe("serializeTag - vulnerability tests", () => {
	it("escapes script injection attempts in attributes", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: {
				name: "viewport",
				content: '<script>alert("XSS")</script>',
			},
		});
		expect(result).toEqual(
			'<meta name="viewport" content="&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"/>',
		);
	});

	it("handles SQL injection payloads in attributes", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: { name: "author", content: '"; DROP TABLE users;--' },
		});
		expect(result).toEqual(
			'<meta name="author" content="&quot;; DROP TABLE users;--"/>',
		);
	});

	it("handles event handler injection attempts in attributes", () => {
		const result = serializeTag({
			tag: "img",
			attributes: { src: "x", onerror: 'alert("XSS")' },
		});
		expect(result).toEqual('<img src="x" onerror="alert(&quot;XSS&quot;)"/>');
	});

	it("sanitizes special characters in tag attributes", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: { name: "<meta>", content: "content&value\"special'" },
		});
		expect(result).toEqual(
			'<meta name="&lt;meta&gt;" content="content&amp;value&quot;special&#39;"/>',
		);
	});

	it("prevents malformed HTML from breaking the output", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: {
				name: "test",
				content: '"></meta><script>alert(1)</script>',
			},
		});
		expect(result).toEqual(
			'<meta name="test" content="&quot;&gt;&lt;/meta&gt;&lt;script&gt;alert(1)&lt;/script&gt;"/>',
		);
	});

	it("ignores attribute keys with malicious patterns", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: { '"><script>alert(1)</script>': "malicious" },
		});
		expect(result).toEqual(
			'<meta &quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;="malicious"/>',
		);
	});

	it("prevents double-escaping of HTML entities", () => {
		const result = serializeTag({
			tag: "meta",
			attributes: { content: "&lt;already-escaped&gt;" },
		});
		expect(result).toEqual('<meta content="&lt;already-escaped&gt;"/>');
	});
});
