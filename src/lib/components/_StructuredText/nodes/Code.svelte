<script lang="ts">
	import type { Code } from 'datocms-structured-text-utils';

	export let node: Code;

  $: ({ code, language } = node)
</script>

<pre class={language}>{code}</pre>
