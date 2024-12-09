/** Replaces special chars (&<>"') with HTML entities */
export const escapeHtmlString = (html: string) => {
	const escaped = html
		.replace(
			/&(?!amp;|lt;|gt;|quot;|apos;)/g, // Don't re-encode these entities
			'&amp;'
		)
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
	return escaped;
};
