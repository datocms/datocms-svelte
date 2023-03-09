<script lang="ts">
	import type { InlineItem } from 'datocms-structured-text-utils';
	import type { DocPageRecord } from './types';

	export let node: InlineItem;
	export let link: DocPageRecord;
</script>

{#if link.__typename == 'DocPageRecord'}
	<a href={`/docs/${link.slug}`}>{link.title}</a>;
{/if}
