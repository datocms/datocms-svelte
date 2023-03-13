<script lang="ts" context="module">
	import IntersectionObserver from 'svelte-intersection-observer';

	const isWindowDefined = typeof window !== 'undefined';

	type Maybe<T> = T | null;

	type ResponsiveImageType = {
		/** A base64-encoded thumbnail to offer during image loading */
		base64?: Maybe<string>;
		/** The height of the image */
		height?: Maybe<number>;
		/** The width of the image */
		width?: number;
		/** The aspect ratio (width/height) of the image */
		aspectRatio?: number;
		/** The HTML5 `sizes` attribute for the image */
		sizes?: Maybe<string>;
		/** The fallback `src` attribute for the image */
		src?: Maybe<string>;
		/** The HTML5 `srcSet` attribute for the image */
		srcSet?: Maybe<string>;
		/** The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format */
		webpSrcSet?: Maybe<string>;
		/** The background color for the image placeholder */
		bgColor?: Maybe<string>;
		/** Alternate text (`alt`) for the image */
		alt?: Maybe<string>;
		/** Title attribute (`title`) for the image */
		title?: Maybe<string>;
	};

	type State = {
		lazyLoad: boolean;
		intersecting: boolean;
		loaded: boolean;
	};

	// See: https://github.com/sveltejs/language-tools/issues/1026#issuecomment-1002839154
	const noTypeCheck = (x: object) => x;

	const imageAddStrategy = ({ lazyLoad, intersecting, loaded }: State) => {
		const isIntersectionObserverAvailable = isWindowDefined
			? !!(window as any).IntersectionObserver
			: false;

		if (!lazyLoad) {
			return true;
		}

		if (!isWindowDefined) {
			return false;
		}

		if (isIntersectionObserverAvailable) {
			return intersecting || loaded;
		}

		return true;
	};

	const imageShowStrategy = ({ lazyLoad, loaded }: State) => {
		const isIntersectionObserverAvailable = isWindowDefined
			? !!(window as any).IntersectionObserver
			: false;

		if (!lazyLoad) {
			return true;
		}

		if (!isWindowDefined) {
			return false;
		}

		if (isIntersectionObserverAvailable) {
			return loaded;
		}

		return true;
	};

	const bogusBaseUrl = 'https://example.com/';

	const buildSrcSet = (
		src: string | null | undefined,
		width: number | undefined,
		candidateMultipliers: number[]
	) => {
		if (!(src && width)) {
			return undefined;
		}

		return candidateMultipliers
			.map((multiplier) => {
				const url = new URL(src, bogusBaseUrl);

				if (multiplier !== 1) {
					url.searchParams.set('dpr', `${multiplier}`);
					const maxH = url.searchParams.get('max-h');
					const maxW = url.searchParams.get('max-w');
					if (maxH) {
						url.searchParams.set('max-h', `${Math.floor(parseInt(maxH) * multiplier)}`);
					}
					if (maxW) {
						url.searchParams.set('max-w', `${Math.floor(parseInt(maxW) * multiplier)}`);
					}
				}

				const finalWidth = Math.floor(width * multiplier);

				if (finalWidth < 50) {
					return null;
				}

				return `${url.toString().replace(bogusBaseUrl, '/')} ${finalWidth}w`;
			})
			.filter(Boolean)
			.join(',');
	};
</script>

<script lang="ts">
	import type * as CSS from 'csstype';

	import { createEventDispatcher } from 'svelte';

	import Sizer from './Sizer.svelte';
	import Placeholder from './Placeholder.svelte';
	import Source from './Source.svelte';

	const dispatch = createEventDispatcher();

	let element: HTMLDivElement;
	let intersecting = false;

	let loaded = false;

	export let alt: string | null = null;

	/** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
	export let data: ResponsiveImageType;

	/** Additional CSS className for root node */
	let klass: string | null = null;
	export { klass as class };

	/** Additional CSS class for the image inside the `<picture />` tag */
	export let pictureClass: string | null = null;

	/** Duration (in ms) of the fade-in transition effect upoad image loading */
	export let fadeInDuration = 500;

	/** Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible */
	export let intersectionThreshold = 0;

	/** Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections */
	export let intersectionMargin = '0px';

	/** Whether enable lazy loading or not */
	let rawLazyLoad = true;
	export { rawLazyLoad as lazyLoad };

	/** Additional CSS rules to add to the root node */
	export let style: Record<string, string> = {};

	/** Additional CSS rules to add to the image inside the `<picture />` tag */
	export let pictureStyle: string | null = null;

	/**
	 * The layout behavior of the image as the viewport changes size
	 *
	 * Possible values:
	 *
	 * * `intrinsic` (default): the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports
	 * * `fixed`: the image dimensions will not change as the viewport changes (no responsiveness) similar to the native img element
	 * * `responsive`: the image will scale the dimensions down for smaller viewports and scale up for larger viewports
	 * * `fill`: image will stretch both width and height to the dimensions of the parent element, provided the parent element is `relative`
	 **/
	export let layout: 'intrinsic' | 'fixed' | 'responsive' | 'fill' = 'intrinsic';

	/** Defines how the image will fit into its parent container when using layout="fill" */
	export let objectFit: CSS.Properties['objectFit'] = undefined;

	/** Defines how the image is positioned within its parent element when using layout="fill". */
	export let objectPosition: CSS.Properties['objectPosition'] = undefined;

	/** Whether the component should use a blurred image placeholder */
	export let usePlaceholder = true;

	/**
	 * The HTML5 `sizes` attribute for the image
	 *
	 * Learn more about srcset and sizes:
	 * -> https://web.dev/learn/design/responsive-images/#sizes
	 * -> https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
	 **/
	export let sizes: HTMLImageElement['sizes'] | null = null;

	/**
	 * When true, the image will be considered high priority. Lazy loading is automatically disabled, and fetchpriority="high" is added to the image.
	 * You should use the priority property on any image detected as the Largest Contentful Paint (LCP) element. It may be appropriate to have multiple priority images, as different images may be the LCP element for different viewport sizes.
	 * Should only be used when the image is visible above the fold.
	 **/
	export let priority = false;

	/**
	 * If `data` does not contain `srcSet`, the candidates for the `srcset` of the image will be auto-generated based on these width multipliers
	 *
	 * Default candidate multipliers are [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]
	 **/
	export let srcSetCandidates: number[] = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];

	$: ({ width, height, aspectRatio } = data);

	$: lazyLoad = priority ? false : rawLazyLoad;

	$: addImage = imageAddStrategy({
		lazyLoad,
		intersecting,
		loaded
	});

	$: showImage = imageShowStrategy({
		lazyLoad,
		intersecting,
		loaded
	});

	let transition = fadeInDuration > 0 ? `opacity ${fadeInDuration}ms` : undefined;
</script>

<IntersectionObserver
	{element}
	bind:intersecting
	threshold={intersectionThreshold}
	rootMargin={intersectionMargin}
>
	<div
		bind:this={element}
		class={klass}
		style:overflow="hidden"
		style:position={style.position ?? layout === 'fill' ? 'absolute' : 'relative'}
		style:width={style.width ?? layout === 'fixed' ? data.width : '100%'}
		style:maxWidth={style.maxWidth ?? layout === 'intrinsic' ? data.width : null}
		style:height={style.height ?? layout === 'fill' ? '100%' : null}
		data-testid="image"
	>
		{#if layout !== 'fill' && width}
			<Sizer {width} {height} {aspectRatio} />
		{/if}

		{#if usePlaceholder && (data.bgColor || data.base64)}
			<Placeholder
				base64={data.base64}
				backgroundColor={data.bgColor}
				{objectFit}
				{objectPosition}
				{showImage}
				{fadeInDuration}
			/>
		{/if}

		{#if addImage}
			<picture style={pictureStyle} data-testid="picture">
				{#if data.webpSrcSet}
					<Source srcset={data.webpSrcSet} sizes={sizes ?? data.sizes ?? null} type="image/webp" />
				{/if}
				<Source
					srcset={data.srcSet ?? buildSrcSet(data.src, data.width, srcSetCandidates) ?? null}
					sizes={sizes ?? data.sizes ?? null}
				/>
				{#if data.src}
					<img
						{...noTypeCheck({
							// See: https://github.com/sveltejs/language-tools/issues/1026#issuecomment-1002839154
							fetchpriority: priority ? 'high' : undefined
						})}
						src={data.src}
						alt={alt ?? data.alt ?? ''}
						title={data.title ?? null}
						on:load={() => {
							dispatch('load');
							loaded = true;
						}}
						class={pictureClass}
						style:opacity={showImage ? 1 : 0}
						style:transition
						style:position="absolute"
						style:left="0"
						style:top="0"
						style:width="100%"
						style:height="100%"
						style:objectFit
						style:objectPosition
						data-testid="img"
					/>
				{/if}
			</picture>
		{/if}
	</div>
</IntersectionObserver>
