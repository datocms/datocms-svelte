<script lang="ts">
	import { isItemLink, type ItemLink } from 'datocms-structured-text-utils';
	import type { DocPageRecord } from './types';

	export let node: ItemLink;
	export let link: DocPageRecord;

	// FIXME
	const transformedMeta = {};
</script>

{#if link.__typename == 'DocPageRecord' && isItemLink(node)}
	<a {...transformedMeta} href={`/docs/${link.slug}`}>
		<slot />
	</a>
{/if}
