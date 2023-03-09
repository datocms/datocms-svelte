<script>
	import StructuredText from '$lib/components/StructuredText.svelte';
	import { isSpan } from 'datocms-structured-text-utils';
	import CustomSpan from '$lib/components/__tests__/__fixtures__/CustomSpan.svelte';
</script>

<h1>DatoCMS Svelte Library</h1>
<h2>StructuredText</h2>

<hr />

<StructuredText
	data={{
		value: {
			schema: 'dast',
			document: {
				type: 'root',
				children: [
					{
						type: 'heading',
						level: 1,
						children: [
							{
								type: 'span',
								value: 'This\nis a '
							},
							{
								type: 'span',
								marks: ['strong'],
								value: 'title'
							}
						]
					}
				]
			}
		}
	}}
/>

<hr />

<StructuredText
	data={{
		value: {
			schema: 'dast',
			document: {
				type: 'root',
				children: [
					{
						type: 'paragraph',
						children: [
							{
								type: 'span',
								value: 'This is a '
							},
							{
								type: 'span',
								marks: ['strong'],
								value: 'title'
							}
						]
					}
				]
			}
		}
	}}
	components={[[isSpan, CustomSpan]]}
/>
