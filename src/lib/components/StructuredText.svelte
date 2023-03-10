<script lang="ts">
	import { type StructuredText, type Document, isStructuredText } from 'datocms-structured-text-utils';

	import type { PredicateComponentTuple } from '$lib';
	
	import Node from './_StructuredText/Node.svelte';

	/** The actual field value you get from DatoCMS **/
	export let data: StructuredText | Document | null = null;

	export let components: PredicateComponentTuple[] = [];

	$: node = data != null && (isStructuredText(data) ? data.value : data).document;
	$: blocks = isStructuredText(data) ? data?.blocks : undefined;
	$: links =  isStructuredText(data) ? data?.links : undefined;
</script>

{#if node}
	<Node {node} {blocks} {links} {components} />
{/if}
