<script context="module" lang="ts">
	export type { StructuredText, Document } from 'datocms-structured-text-utils';
</script>

<script lang="ts">
	import type { SvelteComponentTyped } from 'svelte';
	import type { StructuredText, Node as N } from 'datocms-structured-text-utils';

	import Node from './_StructuredText/Node.svelte';

	/** The actual field value you get from DatoCMS **/
	// FIXME: add support for documents (from CMA) and node (for rendering branches)
	export let data: StructuredText | null = null;

	type PredicateComponentTuple = [(n: N) => boolean, new (...any: any[]) => SvelteComponentTyped];

	export let components: PredicateComponentTuple[] = [];

	$: node = data?.value.document;
	$: blocks = data?.blocks;
	$: links = data?.links;
</script>

{#if node}
	<Node {node} {blocks} {links} {components} />
{/if}
