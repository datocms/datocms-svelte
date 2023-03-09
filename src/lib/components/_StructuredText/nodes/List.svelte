<script lang="ts">
	import type { List } from 'datocms-structured-text-utils';

	export let node: List;

	$: ({ style } = node);
</script>

{#if style === 'numbered'}
	<ol><slot /></ol>
{:else}
	<ul><slot /></ul>
{/if}
