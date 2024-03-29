<script lang="ts">
	import type { Span } from 'datocms-structured-text-utils';

	import Lines from '../utils/Lines.svelte';

	export let node: Span;

	$: ({ type, value, marks } = node);
	$: [mark, ...otherMarks] = marks ?? [];
</script>

{#if mark}
	{#if mark === 'emphasis'}
		<em><svelte:self node={{ type, value, marks: otherMarks }}><slot /></svelte:self></em>
	{:else if mark === 'highlight'}
		<mark><svelte:self node={{ type, value, marks: otherMarks }}><slot /></svelte:self></mark>
	{:else if mark === 'strikethrough'}
		<del><svelte:self node={{ type, value, marks: otherMarks }}><slot /></svelte:self></del>
	{:else if mark === 'strong'}
		<strong><svelte:self node={{ type, value, marks: otherMarks }}><slot /></svelte:self></strong>
	{:else if mark === 'underline'}
		<u><svelte:self node={{ type, value, marks: otherMarks }}><slot /></svelte:self></u>
	{:else if mark === 'code'}
		<code><svelte:self node={{ type, value, marks: otherMarks }}><slot /></svelte:self></code>
	{/if}
{:else}
	<Lines lines={node.value.split(/\n/)} />
{/if}
