<script>
	import { isSpan } from 'datocms-structured-text-utils';

	import { heading, paragraph, paragraphWithLink } from '$lib/components/StructuredText/__tests__/__fixtures__/structuredText';

	import { StructuredText } from '$lib';
	import CustomSpan from '$lib/components/StructuredText/__tests__/__fixtures__/CustomSpan.svelte';
</script>

<h1>StructuredText</h1>

<hr />

<StructuredText data={heading} />

<hr />

<StructuredText data={paragraph} components={[[isSpan, CustomSpan]]} />

<hr />

<StructuredText data={paragraphWithLink} />
