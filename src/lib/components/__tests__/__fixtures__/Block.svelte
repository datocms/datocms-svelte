<script lang="ts">
	import type { Block } from 'datocms-structured-text-utils';
	import type { QuoteRecord } from './types';

	// svelte-ignore unused-export-let
	export let node: Block;
	export let block: QuoteRecord;
</script>

{#if block.__typename == 'QuoteRecord'}
	<figure>
		<blockquote>{block.quote}</blockquote>
		<figcaption>{block.author}</figcaption>
	</figure>
{/if}
