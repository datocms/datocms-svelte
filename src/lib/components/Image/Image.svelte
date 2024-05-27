<script lang="ts">
	import type * as CSS from 'csstype';
	import { createEventDispatcher } from 'svelte';
	import IntersectionObserver from 'svelte-intersection-observer';

	import { imageAddStrategy, imageShowStrategy, absolutePositioning, universalBtoa } from './utils';

	import {
		buildSrcSet,
		dumpStyleAttributes,
		noTypeCheck,
		parseStyleAttributes,
		type ResponsiveImageType
	} from '../NakedImage/utils';

	/** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
	export let data: ResponsiveImageType;

	/** Additional CSS className for root node */
	let rootClass: string | null = null;
	export { rootClass as class };

	/** Additional CSS class for the image inside the `<picture />` tag */
	export let pictureClass: string | null = null;

	/** Additional CSS class for the placeholder element */
	export let placeholderClass: string | null = null;

	/** Duration (in ms) of the fade-in transition effect upoad image loading */
	export let fadeInDuration = 500;

	/** Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible */
	export let intersectionThreshold = 0;

	/** Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections */
	export let intersectionMargin = '0px';

	/** Additional CSS rules to add to the root node */
	export let style: string | null = null;

	/** Additional CSS rules to add to the image inside the `<picture />` tag */
	export let pictureStyle: string | null = null;

	/** Additional CSS rules to add to the placeholder element */
	export let placeholderStyle: string | null = null;

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
	export let objectFit: CSS.PropertiesHyphen['object-fit'] = undefined;

	/** Defines how the image is positioned within its parent element when using layout="fill". */
	export let objectPosition: CSS.PropertiesHyphen['object-position'] = undefined;

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

	const dispatch = createEventDispatcher();

	let rootEl: HTMLDivElement;
	let inView = false;
	let loaded = false;

	$: addImage = imageAddStrategy({ priority, inView, loaded });
	$: showImage = imageShowStrategy({ priority, inView, loaded });

	$: transition = fadeInDuration > 0 ? `opacity ${fadeInDuration}ms` : undefined;

	let basePlaceholderStyle: CSS.PropertiesHyphen;
	$: basePlaceholderStyle = {
		transition,
		opacity: showImage ? 0 : 1,
		// During the opacity transition of the placeholder to the definitive version,
		// hardware acceleration is triggered. This results in the browser trying to render the
		// placeholder with your GPU, causing blurred edges. Solution: style the placeholder
		// so the edges overflow the container
		position: 'absolute',
		left: '-5%',
		top: '-5%',
		width: '110%',
		height: 'auto',
		'max-width': 'none',
		'max-height': 'none',
		...parseStyleAttributes(placeholderStyle)
	};

	$: ({ width, aspectRatio } = data);
	$: height = data.height ?? (aspectRatio ? width / aspectRatio : 0);

	$: svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;
</script>

<IntersectionObserver
	element={rootEl}
	bind:intersecting={inView}
	threshold={intersectionThreshold}
	rootMargin={intersectionMargin}
>
	<div
		bind:this={rootEl}
		class={rootClass}
		style={dumpStyleAttributes({
			overflow: 'hidden',
			...(layout === 'fill'
				? absolutePositioning
				: layout === 'intrinsic'
				? { position: 'relative', width: '100%', 'max-width': `${width}px` }
				: layout === 'fixed'
				? { position: 'relative', width: `${width}px` }
				: { position: 'relative', width: '100%' }),
			...parseStyleAttributes(style)
		})}
		data-testid="image"
	>
		{#if layout !== 'fill'}
			<img
				class={pictureClass}
				style={dumpStyleAttributes({
					display: 'block',
					width: '100%',
					...parseStyleAttributes(pictureStyle)
				})}
				src={`data:image/svg+xml;base64,${universalBtoa(svg)}`}
				aria-hidden="true"
				alt=""
			/>
		{/if}

		{#if usePlaceholder}
			{#if data.base64}
				<img
					aria-hidden="true"
					alt=""
					src={data.base64}
					class={placeholderClass}
					style={dumpStyleAttributes({
						'object-fit': objectFit,
						'object-position': objectPosition,
						...basePlaceholderStyle
					})}
				/>
			{:else if data.bgColor}
				<div
					class={placeholderClass}
					style={dumpStyleAttributes({
						'background-color': data.bgColor,
						...basePlaceholderStyle
					})}
				/>
			{/if}
		{/if}

		{#if addImage}
			<picture data-testid="picture">
				{#if data.webpSrcSet}
					<source srcset={data.webpSrcSet} sizes={sizes ?? data.sizes ?? null} type="image/webp" />
				{/if}
				<source
					srcset={data.srcSet ?? buildSrcSet(data.src, data.width, srcSetCandidates) ?? null}
					sizes={sizes ?? data.sizes ?? null}
				/>
				{#if data.src}
					<img
						src={data.src}
						alt={data.alt ?? ''}
						title={data.title ?? null}
						on:load={() => {
							dispatch('load');
							loaded = true;
						}}
						{...noTypeCheck({
							fetchpriority: priority ? 'high' : undefined
						})}
						class={pictureClass}
						style={dumpStyleAttributes({
							opacity: showImage ? 1 : 0,
							transition,
							...absolutePositioning,
							'object-fit': objectFit,
							'object-position': objectPosition,
							...parseStyleAttributes(pictureStyle)
						})}
						data-testid="img"
					/>
				{/if}
			</picture>
		{/if}
	</div>
</IntersectionObserver>
