import type { Node } from 'datocms-structured-text-utils';
import type { SvelteComponentTyped } from 'svelte';

export { default as StructuredText } from './components/StructuredText/StructuredText.svelte';
export { default as Image } from './components/Image/Image.svelte';

export type PredicateComponentTuple = [
	(n: Node) => boolean,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...any: any) => SvelteComponentTyped
];
