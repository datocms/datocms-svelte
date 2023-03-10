<script>
	import StructuredText from '$lib/components/StructuredText.svelte';
	import { isSpan } from 'datocms-structured-text-utils';
	import CustomSpan from '$lib/components/__tests__/__fixtures__/CustomSpan.svelte';

	import { heading, paragraph } from '$lib/components/__tests__/__fixtures__/structuredText';
</script>

<h1>DatoCMS Svelte Library</h1>
<h2>StructuredText</h2>

<hr />

<StructuredText data={heading} />

<hr />

<StructuredText data={paragraph} components={[[isSpan, CustomSpan]]} />

