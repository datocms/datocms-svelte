<script lang="ts">
	import type { Blockquote } from 'datocms-structured-text-utils';

	export let node: Blockquote;

	node;
	// ↑
	// This is a hack: it's important to declare the `node` prop: all the components
	// for rendering node types will receive the node at rendering time. That gives
	// users of the library the freedom to write custom components with special behaviours based on the
	// node specifities. But we don't use the prop in this default block, so the linter
	// triggers a warning. At the same time, in Svelte there's no reliable way to disable the
	// `svelte(unused-export-let)` warning.
	//
	// Mentioning the node like this will silence the warning.
	//
	// If you're building a custom component and you're gonna use the node in the component,
	// you can omit this statement.
</script>

<blockquote><slot /></blockquote>
