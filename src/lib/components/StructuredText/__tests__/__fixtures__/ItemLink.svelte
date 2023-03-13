<script lang="ts">
	import { defaultMetaTransformer } from 'datocms-structured-text-generic-html-renderer';
	import { isItemLink, type ItemLink } from 'datocms-structured-text-utils';
	
	import type { DocPageRecord } from './types';

	export let node: ItemLink;
	export let link: DocPageRecord;

	$: ({ meta } = node)
	$: transformedMeta = meta ? defaultMetaTransformer({node, meta}) : null;
</script>

{#if link.__typename == 'DocPageRecord' && isItemLink(node)}
	<a {...transformedMeta} href={`/docs/${link.slug}`}>
		<slot />
	</a>
{/if}
