<script lang="ts">
	import type * as CSS from 'csstype';
	import { createEventDispatcher } from 'svelte';

	import {
		buildSrcSet,
		dumpStyleAttributes,
		noTypeCheck,
		parseStyleAttributes,
		type ResponsiveImageType
	} from './utils';

	/** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
	export let data: ResponsiveImageType;

	/** Additional CSS className for the root <picture> tag */
	export let pictureClass: string | null = null;

	/** Additional CSS rules to add to the root <picture> tag */
	export let pictureStyle: string | null = null;

	/** Additional CSS className for the <img> tag */
	export let imgClass: string | null = null;

	/** Additional CSS rules to add to the <img> tag */
	export let imgStyle: string | null = null;

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

	/**
	 * Defines which referrer is sent when fetching the image
	 * Read more: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy
	 *
	 * Defaults to `no-referrer-when-downgrade` to give more useful stats in DatoCMS Project Usages
	 **/
	export let referrerPolicy: ReferrerPolicy = 'no-referrer-when-downgrade';

	const dispatch = createEventDispatcher();

	let loaded = false;

	let placeholderStyle: CSS.PropertiesHyphen | undefined;
	$: placeholderStyle =
		usePlaceholder && !loaded && data.base64
			? {
					'background-image': `url("${data.base64}")`,
					'background-size': 'cover',
					'background-repeat': 'no-repeat',
					'background-position': '50% 50%',
					color: 'transparent'
			  }
			: usePlaceholder && !loaded && data.bgColor
			? { 'background-color': data.bgColor ?? undefined, color: 'transparent' }
			: undefined;

	$: ({ width } = data);
	$: height = data.height ?? Math.round(data.aspectRatio ? width / data.aspectRatio : 0);

	let sizingStyle: CSS.PropertiesHyphen | undefined;
	$: sizingStyle = {
		'aspect-ratio': `${width} / ${height}`,
		width: '100%',
		'max-width': `${width}px`,
		height: 'auto'
	};
</script>

<picture data-testid="picture" class={pictureClass} {pictureStyle}>
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
			loading={priority ? undefined : 'lazy'}
			class={imgClass}
			style={dumpStyleAttributes({
				...placeholderStyle,
				...sizingStyle,
				...parseStyleAttributes(imgStyle)
			})}
			referrerpolicy={referrerPolicy}
			data-testid="img"
		/>
	{/if}
</picture>
