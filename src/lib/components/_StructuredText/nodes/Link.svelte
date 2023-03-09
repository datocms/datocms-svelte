<script lang="ts">
	import type { Link } from 'datocms-structured-text-utils';

	export let node: Link;

	$: ({ url } = node);
</script>

<a href={url}><slot /></a>
