<script lang="ts">
	import type { Link } from 'datocms-structured-text-utils';

	export let node: Link;

	$: ({ url, meta } = node);

	let target: string | undefined = undefined;
	$: {
		const targetMetaEntry = meta?.find((metaEntry) => metaEntry.id === 'target');
		if (targetMetaEntry?.value) {
			target = targetMetaEntry.value;
		}
	}
	let rel: string | undefined = undefined;
	$: {
		const relMetaEntry = meta?.find((metaEntry) => metaEntry.id === 'rel');
		if (relMetaEntry?.value) {
			rel = relMetaEntry.value;
		}
	}
</script>

<a href={url} {target} {rel}><slot /></a>
