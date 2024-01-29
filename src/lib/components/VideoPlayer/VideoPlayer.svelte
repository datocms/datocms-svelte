<script context="module" lang="ts">
	type Maybe<T> = T | null;

	// type Style = Maybe<'style'>;
	type Title = Maybe<string>;
	type PlaybackId = Maybe<string>;
	type Placeholder = Maybe<string>;

	type AttrsForMuxPlayer = {
		// style?: Style;
		title?: Title;
		playbackId?: PlaybackId;
		placeholder?: Placeholder;
	};

	type UseVideoPlayerOptions = {
		props: { data?: VideoType };
	};

	type UseVideoPlayer = ({ props }: UseVideoPlayerOptions) => AttrsForMuxPlayer;

	export type VideoType = {
		/** Title attribute (`title`) for the video */
		title?: Maybe<string>;
		/** The height of the video */
		height?: Maybe<number>;
		/** The width of the video */
		width?: Maybe<number>;
		/** The MUX playbaack ID */
		muxPlaybackId?: Maybe<string>;
		/** The MUX playbaack ID */
		playbackId?: Maybe<string>;
		/** A data: URI containing a blurhash for the video  */
		blurUpThumb?: Maybe<string>;
	};

	const computedPlaybackId = (
		muxPlaybackId: Maybe<string> | undefined,
		playbackId: Maybe<string> | undefined
	) => {
		return muxPlaybackId || playbackId || undefined;
	};

	const doesNotWantAspectRatio = (props: SvelteAllProps) => {
		return Object.hasOwn(props, 'style') && props.style === undefined;
	};

	const computedStyle = (
		props: SvelteAllProps,
		style: Maybe<string> | undefined,
		width: Maybe<number> | undefined,
		height: Maybe<number> | undefined
	) => {
		if (doesNotWantAspectRatio(props)) return undefined;

		const aspectRatio = width && height ? `aspect-ratio: ${width} / ${height}` : undefined;

		const styleValues = [aspectRatio, style].filter(Boolean);

		return styleValues.length > 0 ? styleValues.join('; ') : undefined;
	};

	const computedPlaceholder = (blurUpThumb: Maybe<string> | undefined) => {
		return blurUpThumb || undefined;
	};

	const computedTitle = (title: Maybe<string> | undefined) => {
		return title || undefined;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	export let data: Maybe<VideoType> = {};
	export let style: Maybe<string> | undefined = undefined;

	const { muxPlaybackId, playbackId, title, width, height, blurUpThumb } = data || {};

	// Composing props like this and then spreading them on <mux-player />
	// avoid setting attributes as "undefined".
	const props = {
		'playback-id': computedPlaybackId(muxPlaybackId, playbackId),
		title: computedTitle(title),
		style: computedStyle($$props, style, width, height),
		placeholder: computedPlaceholder(blurUpThumb)
	};

	onMount(async () => {
		await import('@mux/mux-player');
	});
</script>

<mux-player stream-type="on-demand" {...props} class={$$props.class ?? undefined} />
