<script context="module" lang="ts">
	import type {
		CmcdTypes,
		MaxResolutionValue,
		MinResolutionValue,
		PlaybackTypes,
		RenditionOrderValue,
		StreamTypes
	} from '@mux/playback-core/.';
	import type { MuxPlayerElementEventMap, Tokens } from '@mux/mux-player';

	type Maybe<T> = T | null;
	type ValueOf<T> = T[keyof T];

	type VideoApiAttributes = {
		currentTime: number;
		volume: number;
		paused: boolean;
		src: string | null;
		poster: string;
		playbackRate: number;
		playsInline: boolean;
		preload: string;
		crossOrigin: string;
		autoPlay: boolean | string;
		loop: boolean;
		muted: boolean;
		style: string;
	};

	type MuxMediaPropTypes = {
		audio: boolean;
		envKey: string;
		debug: boolean;
		disableCookies: boolean;
		disablePictureInPicture?: boolean;
		metadata: {
			[k: string]: any;
		};
		extraSourceParams: Record<string, any>;
		_hlsConfig: MuxPlayerElement['_hlsConfig'];
		beaconCollectionDomain: string;
		customDomain: string;
		playbackId: string;
		preferPlayback: ValueOf<PlaybackTypes> | undefined;
		streamType: ValueOf<StreamTypes> | 'll-live' | 'live:dvr' | 'll-live:dvr';
		defaultStreamType: ValueOf<StreamTypes>;
		targetLiveWindow: number;
		startTime: number;
		storyboardSrc: string;
		preferCmcd: ValueOf<CmcdTypes> | undefined;
	};

	export type MuxPlayerProps = {
		class?: string;
		hotkeys?: string[];
		nohotkeys?: boolean;
		defaultHiddenCaptions?: boolean;
		playerSoftwareVersion?: string;
		playerSoftwareName?: string;
		forwardSeekOffset?: number;
		backwardSeekOffset?: number;
		maxResolution?: MaxResolutionValue;
		minResolution?: MinResolutionValue;
		renditionOrder?: RenditionOrderValue;
		metadataVideoId?: string;
		metadataVideoTitle?: string;
		metadataViewerUserId?: string;
		primaryColor?: string;
		secondaryColor?: string;
		accentColor?: string;
		placeholder?: string;
		playbackRates?: number[];
		defaultShowRemainingTime?: boolean;
		defaultDuration?: number;
		noVolumePref?: boolean;
		thumbnailTime?: number;
		title?: string;
		tokens?: Tokens;
		theme?: string;
		themeProps?: {
			[k: string]: any;
		};
	} & Partial<MuxMediaPropTypes> &
		Partial<VideoApiAttributes>;

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

	type VideoPlayerProps = {
		data?: VideoType;
	} & Partial<MuxPlayerProps>;

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

	const doesNotWantDisableCookies = (props: VideoPlayerProps) => {
		return Object.hasOwn(props, 'disableCookies') && props.disableCookies === undefined;
	};

	const computedDisableCookies = (
		props: VideoPlayerProps,
		_disableCookies: Maybe<MuxPlayerProps['disableCookies']> | undefined
	) => {
		if (doesNotWantDisableCookies(props)) {
			return undefined;
		} else if (Object.hasOwn(props, 'disableCookies')) {
			return props.disableCookies;
		}

		return true;
	};

	type KeyTypes = string | number | symbol;

	export const isNil = (x: unknown): x is null | undefined => x == undefined;

	// Type Guard to determine if a given key is actually a key of some object of type T
	export const isKeyOf = <T extends {} = any>(
		k: KeyTypes,
		o: Maybe<T> | undefined
	): k is keyof T => {
		if (isNil(o)) return false;
		return k in o;
	};

	const PropToAttrNameMap = {
		crossOrigin: 'crossorigin',
		viewBox: 'viewBox',
		playsInline: 'playsinline',
		autoPlay: 'autoplay',
		playbackRate: 'playbackrate',
		playbackRates: 'playbackrates'
	};

	const toKebabCase = (string: string) =>
		string.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

	export const toNativeAttrName = (propName: string, propValue: any): string | undefined => {
		if (typeof propValue === 'boolean' && !propValue) return undefined;
		if (isKeyOf(propName, PropToAttrNameMap)) return PropToAttrNameMap[propName];
		if (typeof propValue == undefined) return undefined;
		if (/[A-Z]/.test(propName)) return toKebabCase(propName);

		return propName;
	};

	export const toNativeAttrValue = (propValue: any, propName: string) => {
		if (Array.isArray(propValue)) return propValue.join(' ');
		if (typeof propValue === 'boolean') return propValue;

		return propValue;
	};

	const toHTMLAttrs = (props = {}) => {
		return Object.entries(props).reduce<{ [k: string]: string }>(
			(transformedProps, [propName, propValue]) => {
				const attrName = toNativeAttrName(propName, propValue);

				// prop was stripped. Don't add.
				if (!attrName) {
					return transformedProps;
				}

				const attrValue = toNativeAttrValue(propValue, propName);
				transformedProps[attrName] = attrValue;
				return transformedProps;
			},
			{}
		);
	};
</script>

<script lang="ts">
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import type MuxPlayerElement from '@mux/mux-player';
	import mux from 'mux-embed';

	// See: https://stackoverflow.com/a/76291677/1338248
	interface $$Props extends VideoPlayerProps {}

	export let data: VideoType = {};
	export let style: Maybe<MuxPlayerProps['style']> | undefined = undefined;
	export let disableCookies: Maybe<MuxPlayerProps['disableCookies']> | undefined = undefined;

	let muxPlayerElementImported = false;

	let muxPlayerElement: MuxPlayerElement;

	let computedProps: VideoPlayerProps;

	$: {
		const { muxPlaybackId, playbackId, title, width, height, blurUpThumb } = data || {};

		// Composing props like this and then spreading them on <mux-player />
		// avoid setting attributes as "undefined".
		computedProps = {
			playbackId: computedPlaybackId(muxPlaybackId, playbackId),
			title: computedTitle(title),
			style: computedStyle($$props, style, width, height),
			placeholder: computedPlaceholder(blurUpThumb),
			disableCookies: computedDisableCookies($$props, disableCookies)
		};
	}

	$: {
		if (muxPlayerElementImported && muxPlayerElement && Object.hasOwn($$props, 'paused')) {
			const paused = $$props.paused;

			if (paused) {
				muxPlayerElement.pause();
			} else {
				muxPlayerElement.play();
			}
		}
	}

	onMount(async () => {
		await import('@mux/mux-player');
		muxPlayerElementImported = true;
	});
</script>

<mux-player
	bind:this={muxPlayerElement}
	stream-type="on-demand"
	{...toHTMLAttrs(computedProps)}
	{...toHTMLAttrs($$restProps)}
	on:abort
	on:canplay
	on:canplaythrough
	on:emptied
	on:loadstart
	on:loadeddata
	on:loadedmetadata
	on:progress
	on:durationchange
	on:volumechange
	on:ratechange
	on:resize
	on:waiting
	on:play
	on:playing
	on:timeupdate
	on:pause
	on:seeking
	on:seeked
	on:stalled
	on:suspend
	on:ended
	on:error
	on:cuepointchange
	on:cuepointschange
/>
