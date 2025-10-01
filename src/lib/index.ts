import type {
	Node,
	CdaStructuredTextValue,
	CdaStructuredTextRecord,
	TypesafeCdaStructuredTextValue,
	Document as StructuredTextDocument,
} from 'datocms-structured-text-utils';

export { default as NakedImage } from './components/NakedImage/NakedImage.svelte';
export type { ResponsiveImageType } from './components/NakedImage/utils';

export { default as Head } from './components/Head/Head.svelte';
export { default as Image } from './components/Image/Image.svelte';
export { default as StructuredText } from './components/StructuredText/StructuredText.svelte';
export { default as VideoPlayer } from './components/VideoPlayer/VideoPlayer.svelte';

export * from './stores/querySubscription';

export type {
	StructuredTextDocument,
	CdaStructuredTextValue,
	TypesafeCdaStructuredTextValue,
	CdaStructuredTextRecord,
};

export type PredicateComponentTuple = [
	(n: Node) => boolean,
	// should be
	// typeof SvelteComponent<any> | Component<any, any, any>,
	// but Svelte 4 does not have `Component`

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any
];
