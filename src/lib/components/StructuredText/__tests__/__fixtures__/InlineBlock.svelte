<script lang="ts">
	import { isBlock, isInlineBlock,  type InlineBlock } from 'datocms-structured-text-utils';
	import type { MentionRecord } from './types';

	export let node: InlineBlock;
	export let block: MentionRecord;
</script>

{#if block.__typename == 'MentionRecord' && isInlineBlock(node)}
  <em>{block.name}</em>
{/if}
