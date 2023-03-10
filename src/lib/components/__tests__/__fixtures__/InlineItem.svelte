<script lang="ts">
	import { isInlineItem, type InlineItem } from 'datocms-structured-text-utils';
	import type { DocPageRecord } from './types';

	export let node: InlineItem;
	export let link: DocPageRecord;
</script>

{#if link.__typename == 'DocPageRecord' && isInlineItem(node)}
	<a href={`/docs/${link.slug}`}>{link.title}</a>;
{/if}
