import type * as CSS from 'csstype';

type Maybe<T> = T | null;

export type ResponsiveImageType = {
	/** A base64-encoded thumbnail to offer during image loading */
	base64?: Maybe<string>;
	/** The height of the image */
	height?: Maybe<number>;
	/** The width of the image */
	width: number;
	/** The aspect ratio (width/height) of the image */
	aspectRatio?: number;
	/** The HTML5 `sizes` attribute for the image */
	sizes?: Maybe<string>;
	/** The fallback `src` attribute for the image */
	src?: Maybe<string>;
	/** The HTML5 `srcSet` attribute for the image */
	srcSet?: Maybe<string>;
	/** The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format */
	webpSrcSet?: Maybe<string>;
	/** The background color for the image placeholder */
	bgColor?: Maybe<string>;
	/** Alternate text (`alt`) for the image */
	alt?: Maybe<string>;
	/** Title attribute (`title`) for the image */
	title?: Maybe<string>;
};
export const parseStyleAttributes = (styleString: string | null): CSS.PropertiesHyphen => {
	const styleRules: Record<string, string> = {};

	if (styleString) {
		for (const rule of styleString.split(';')) {
			const [key, value] = rule.split(':').map((part) => part.trim());
			if (key && value) {
				styleRules[key] = value;
			}
		}
	}

	return styleRules;
};

export const dumpStyleAttributes = (style: CSS.PropertiesHyphen): string => {
	return Object.entries(style)
		.map(([key, value]) =>
			typeof value !== 'undefined' && value !== 'null' ? `${key}: ${value};` : undefined
		)
		.filter(Boolean)
		.join(' ');
};

// See: https://github.com/sveltejs/language-tools/issues/1026#issuecomment-1002839154
export const noTypeCheck = (x: object) => x;

const bogusBaseUrl = 'https://example.com/';

export const buildSrcSet = (
	src: string | null | undefined,
	width: number | undefined,
	candidateMultipliers: number[]
) => {
	if (!(src && width)) {
		return undefined;
	}

	return candidateMultipliers
		.map((multiplier) => {
			const url = new URL(src, bogusBaseUrl);

			if (multiplier !== 1) {
				url.searchParams.set('dpr', `${multiplier}`);
				const maxH = url.searchParams.get('max-h');
				const maxW = url.searchParams.get('max-w');
				if (maxH) {
					url.searchParams.set('max-h', `${Math.floor(Number.parseInt(maxH) * multiplier)}`);
				}
				if (maxW) {
					url.searchParams.set('max-w', `${Math.floor(Number.parseInt(maxW) * multiplier)}`);
				}
			}

			const finalWidth = Math.floor(width * multiplier);

			if (finalWidth < 50) {
				return null;
			}

			return `${url.toString().replace(bogusBaseUrl, '/')} ${finalWidth}w`;
		})
		.filter(Boolean)
		.join(',');
};
