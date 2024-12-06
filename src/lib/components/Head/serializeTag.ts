import type { GenericTag, SeoOrFaviconTag } from "./Head.svelte";

/** Replaces special chars (&<>"') with HTML entities */
export const escapeHtml = (html: string) => {
	return (
		html
			.replace(/[<>"']/g, (match) => {
				switch (match) {
					case "<":
						return "&lt;";
					case ">":
						return "&gt;";
					case '"':
						return "&quot;";
					case "'":
						return "&#39;";
					default:
						return match;
				}
			})
			// ensure existing HTML entities (like &#xA9; or &copy;) are left untouched
			.replace(/&(?!#?[a-z0-9]+;)/gi, "&amp;")
	);
};

export const serializeTag = (metaTag: GenericTag | SeoOrFaviconTag) => {
	const { tag, attributes, content } = metaTag;

	const serializedAttributes: string[] = attributes
		? Object.entries(attributes).flatMap(([key, value]) =>
				value ? `${escapeHtml(key)}="${escapeHtml(value)}"` : [],
			)
		: [];

	const attributesString: string =
		serializedAttributes.length > 0 ? ` ${serializedAttributes.join(" ")}` : "";

	return content
		? `<${tag}${attributesString}>${content}</${tag}>`
		: `<${tag}${attributesString}/>`;
};
