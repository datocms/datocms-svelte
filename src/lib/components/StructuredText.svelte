<script lang="ts">
	import type { StructuredText } from 'datocms-structured-text-utils';

	import type { PredicateComponentTuple } from '$lib';
	
	import Node from './_StructuredText/Node.svelte';

	/** The actual field value you get from DatoCMS **/
	// FIXME: add support for documents (from CMA) and node (for rendering branches)
	export let data: StructuredText | null = null;

	export let components: PredicateComponentTuple[] = [];

	$: node = data?.value.document;
	$: blocks = data?.blocks;
	$: links = data?.links;
</script>

{#if node}
	<Node {node} {blocks} {links} {components} />
{/if}
