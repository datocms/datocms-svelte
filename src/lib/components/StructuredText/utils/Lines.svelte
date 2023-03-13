<script lang="ts">
	export let lines: string[] = [];

	$: [first, ...rest] = lines;
</script>

{first}

{#if rest.length > 0}
	<br />
	<svelte:self lines={rest} />
{/if}
