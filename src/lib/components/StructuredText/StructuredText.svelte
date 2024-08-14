<script lang="ts">
	import {
		type StructuredText,
		type Document,
		type Node as DastNode,
		isStructuredText,
		isDocument,
		isNode
	} from 'datocms-structured-text-utils';

	import type { PredicateComponentTuple } from '$lib';

	import Node from './Node.svelte';

	/** The actual field value you get from DatoCMS **/
	export let data: StructuredText | Document | DastNode | null | undefined = null;

	export let components: PredicateComponentTuple[] = [];

	$: node = !data
		? null
		: isStructuredText(data) && isDocument(data.value)
		? data.value.document
		: isDocument(data)
		? data.document
		: isNode(data)
		? data
		: undefined;

	$: blocks = isStructuredText(data) ? data?.blocks : undefined;
	$: links = isStructuredText(data) ? data?.links : undefined;
</script>

{#if node}
	<Node {node} {blocks} {links} {components} />
{/if}
