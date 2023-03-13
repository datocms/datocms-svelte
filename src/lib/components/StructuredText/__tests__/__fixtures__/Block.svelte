<script lang="ts">
	import { isBlock, type Block } from 'datocms-structured-text-utils';
	import type { QuoteRecord } from './types';

	export let node: Block;
	export let block: QuoteRecord;
</script>

{#if block.__typename == 'QuoteRecord' && isBlock(node)}
	<figure>
		<blockquote>{block.quote}</blockquote>
		<figcaption>{block.author}</figcaption>
	</figure>
{/if}
