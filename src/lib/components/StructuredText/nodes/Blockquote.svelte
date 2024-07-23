<script lang="ts">
	import type { Blockquote } from 'datocms-structured-text-utils';

	export let node: Blockquote;
</script>

<blockquote>
	<slot />
	<footer>{node.attribution}</footer>
</blockquote>
