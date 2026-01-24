<script context="module" lang="ts">
	import type {
		CmcdTypes,
		MaxResolutionValue,
		MinResolutionValue,
		PlaybackTypes,
		RenditionOrderValue,
		StreamTypes
	} from '@mux/playback-core';

	import type { Tokens } from '@mux/mux-player';

	type ValueOf<T> = T[keyof T];
	type Maybe<T> = T | null;
	type Possibly<T> = Maybe<T> | undefined;

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
		disableTracking: boolean;
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

	export type Video = {
		/** Title attribute (`title`) for the video */
		title?: Maybe<string>;
		/** Alt attribute used for content link integration (passed as data-datocms-content-link-source) */
		alt?: Maybe<string>;
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

	type VideoPlayerProps = Partial<MuxPlayerProps> & {
		data?: Video;
	};

	const computedTitle = (title: Possibly<string>) => {
		return title ? { title } : undefined;
	};

	const computedPlaybackId = (muxPlaybackId: Possibly<string>, playbackId: Possibly<string>) => {
		if (!(muxPlaybackId || playbackId)) return undefined;

		return { playbackId: `${muxPlaybackId || playbackId}` };
	};

	const computedAspectRatio = (width: Possibly<number>, height: Possibly<number>) => {
		if (!(width && height)) return undefined;

		return `aspect-ratio: ${width} / ${height}`;
	};

	const computedStyle = (
		style: MuxPlayerProps['style'],
		width: Possibly<number>,
		height: Possibly<number>
	) => {
		const styleRules = [computedAspectRatio(width, height), style].filter(Boolean);

		if (styleRules.length === 0) return undefined;

		return { style: styleRules.join('; ') };
	};

	const computedPlaceholder = (blurUpThumb: Possibly<string>) => {
		return blurUpThumb ? { placeholder: blurUpThumb } : undefined;
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
	import { onMount } from 'svelte';
	import type MuxPlayerElement from '@mux/mux-player';
	import { decodeStega } from '@datocms/content-link';

	// See: https://stackoverflow.com/a/76291677/1338248
	interface $$Props extends VideoPlayerProps {}

	export let data: Video = {};
	export let style: MuxPlayerProps['style'] = undefined;
	export let preload: MuxPlayerProps['preload'] = 'metadata';
	export let disableCookies: MuxPlayerProps['disableCookies'] = true;
	export let disableTracking: MuxPlayerProps['disableTracking'] = true;

	let muxPlayerElementImported = false;

	let muxPlayerElement: MuxPlayerElement;

	let computedProps: VideoPlayerProps;

	// Extract alt for DatoCMS Content Link integration
	// See: https://github.com/datocms/content-link
	let alt: Possibly<string>;
	let contentLinkSource: Possibly<string>;

	$: {
		const { muxPlaybackId, playbackId, title, width, height, blurUpThumb, alt: dataAlt } = data || {};

		alt = dataAlt;
		contentLinkSource = alt && decodeStega(alt) ? alt : undefined;

		// Composing props like this and then spreading them on <mux-player />
		// avoid setting attributes as "undefined".
		computedProps = {
			...(computedTitle(title) || {}),
			...(computedPlaybackId(muxPlaybackId, playbackId) || {}),
			...(computedStyle(style, width, height) || {}),
			...(computedPlaceholder(blurUpThumb) || {}),
			disableCookies,
			disableTracking,
			preload
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
	data-datocms-content-link-source={contentLinkSource}
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
