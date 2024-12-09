import { escapeHtmlString } from '$lib/util/escapeHtmlString';
import type { HeadTags } from '$lib/components/Head/Head.svelte';

export interface GenericHeadTag {
	tag: string;
	name?: string | null;
	attributes?: Record<string, string | null | undefined> | null;
	content?: string | null;
}

export type SupportedHeadTags = HeadTags | GenericHeadTag[];

export const headTagsToEscapedStrings = (headTags: SupportedHeadTags): string[] => {
	const tagsAsEscapedStrings = headTags.map((metaTag) => {
		const { tag, attributes, content } = metaTag;

		const serializedAttributes: string[] =
			attributes && typeof attributes === 'object'
				? Object.entries(attributes).flatMap(([key, value]) =>
						value ? `${escapeHtmlString(key)}="${escapeHtmlString(value)}"` : []
				  )
				: [];

		const attributesString: string =
			serializedAttributes?.length > 0 ? ` ${serializedAttributes.join(' ')}` : '';

		return content
			? `<${tag}${attributesString}>${content}</${tag}>`
			: `<${tag}${attributesString}/>`;
	});

	return tagsAsEscapedStrings;
};
