import type { Node } from 'datocms-structured-text-utils';
import type { SvelteComponent } from 'svelte';

export { default as StructuredText } from './components/StructuredText/StructuredText.svelte';
export { default as Image } from './components/Image/Image.svelte';
export { default as Head } from './components/Head/Head.svelte';
export { default as VideoPlayer } from './components/VideoPlayer/VideoPlayer.svelte';

export type PredicateComponentTuple = [
	(n: Node) => boolean,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...any: any) => SvelteComponent
];
