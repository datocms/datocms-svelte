<script lang="ts">
	import type { Heading } from 'datocms-structured-text-utils';

	export let node: Heading;

	$: ({ level = 1 } = node);
	$: element = `h${level + 1}`;
</script>

<svelte:element this={element}><slot /></svelte:element>
