# Progressive responsive image

`<Image>` and `<NakedImage />` are Svelte component specially designed to work seamlessly with DatoCMS’s [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) which optimizes image loading for your websites.

- TypeScript ready;
- Usable both client and server side;
- Compatible with vanilla Svelte and Sveltekit;

### Out-of-the-box features

- Offers optimized version of images for browsers that support WebP/AVIF format
- Generates multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Efficiently lazy loads images to speed initial page load and save bandwidth
- Holds the image position so your page doesn’t jump while images load
- Uses either blur-up or background color techniques to show a preview of the image while it loads

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Setup](#setup)
- [Usage](#usage)
- [`<Image />` vs `<NakedImage />`](#image--vs-nakedimage-)
- [Example](#example)
- [The `ResponsiveImage` object](#the-responsiveimage-object)
- [`<NakedImage />`](#nakedimage-)
  - [Props](#props)
  - [Events](#events)
- [`<Image />`](#image-)
  - [Props](#props-1)
  - [Events](#events-1)
  - [Layout mode](#layout-mode)
  - [Intersection Observer](#intersection-observer)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Setup

You can import the components like this:

```js
import { Image, NakedImage } from '@datocms/svelte';
```

## Usage

1. Use `<Image>` or `<NakedImage />` in place of the regular `<img />` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#responsive-images)

The GraphQL query returns multiple thumbnails with optimized compression. The components automatically set up the "blur-up" effect as well as lazy loading of images further down the screen.

## `<Image />` vs `<NakedImage />`

Even though their purpose is the same, there are some significant differences between these two components. Depending on your specific needs, you can choose to use one or the other:

- `<NakedImage />` generates minimum JS footprint, outputs a single `<picture />` element and implements lazy-loading using the native [`loading="lazy"` attribute](https://web.dev/articles/browser-level-image-lazy-loading). The placeholder is set as the background to the image itself.
- `<Image />` has the ability to set a cross-fade effect between the placeholder and the original image, but at the cost of generating more complex HTML output composed of multiple elements around the main `<picture />` element. It also implements lazy-loading through `IntersectionObserver`, which allows customization of the thresholds at which lazy loading occurs.

## Example

For a fully working example take a look at [`routes` directory](https://github.com/datocms/datocms-svelte/tree/main/src/routes/image/+page.svelte).

Here is a minimal starting point:

```svelte
<script>

import { onMount } from 'svelte';

import { Image, NakedImage } from '@datocms/svelte';

const query = gql`
  query {
    blogPost {
      title
      cover {
        responsiveImage(
          imgixParams: { fit: crop, w: 300, h: 300, auto: format }
        ) {
          # always required
          src
          width
          height
          # not required, but strongly suggested!
          alt
          title
          # blur-up placeholder, JPEG format, base64-encoded, or...
          base64
          # background color placeholder
          bgColor
          # you can omit `sizes` if you explicitly pass the `sizes` prop to the image component
          sizes
        }
      }
    }
  }
`;

export let data = null;

onMount(async () => {
  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: "Bearer AN_API_TOKEN",
    },
    body: JSON.stringify({ query })
  })

  const json = await response.json()

  data = json.data;
});

</script>

{#if data}
	<Image data={data.blogPost.cover.responsiveImage} />
	<NakedImage data={data.blogPost.cover.responsiveImage} />
{/if}
```

## The `ResponsiveImage` object

The `data` prop of both components expects an object with the same shape as the one returned by `responsiveImage` GraphQL call. It's up to you to make a GraphQL query that will return the properties you need for a specific use of the `<datocms-image>` component.

- The minimum required properties for `data` are: `src`, `width` and `height`;
- `alt` and `title`, while not mandatory, are all highly suggested, so remember to use them!
- If you don't request `srcSet`, the component will auto-generate an `srcset` based on `src` + the `srcSetCandidates` prop (it can help reducing the GraphQL response size drammatically when many images are returned);
- We strongly to suggest to always specify [`{ auto: format }`](https://docs.imgix.com/apis/rendering/auto/auto#format) in your `imgixParams`, instead of requesting `webpSrcSet`, so that you can also take advantage of more performant optimizations (AVIF), without increasing GraphQL response size;
- If you request both the `bgColor` and `base64` property, the latter will take precedence, so just avoid querying both fields at the same time, as it will only make the GraphQL response bigger :wink:;
- You can avoid requesting `sizes` and directly pass a `sizes` prop to the component to reduce the GraphQL response size;

Here's a complete recap of what `responsiveImage` offers:

| property    | type    | required           | description                                                                                                                                                                                    |
| ----------- | ------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src         | string  | :white_check_mark: | The `src` attribute for the image                                                                                                                                                              |
| width       | integer | :white_check_mark: | The width of the image                                                                                                                                                                         |
| height      | integer | :white_check_mark: | The height of the image                                                                                                                                                                        |
| alt         | string  | :x:                | Alternate text (`alt`) for the image (not required, but strongly suggested!)                                                                                                                   |
| title       | string  | :x:                | Title attribute (`title`) for the image (not required, but strongly suggested!)                                                                                                                |
| sizes       | string  | :x:                | The HTML5 `sizes` attribute for the image (omit it if you're already passing a `sizes` prop to the Image component)                                                                            |
| base64      | string  | :x:                | A base64-encoded thumbnail to offer during image loading                                                                                                                                       |
| bgColor     | string  | :x:                | The background color for the image placeholder (omit it if you're already requesting `base64`)                                                                                                 |
| srcSet      | string  | :x:                | The HTML5 `srcSet` attribute for the image (can be omitted, the Image component knows how to build it based on `src`)                                                                          |
| webpSrcSet  | string  | :x:                | The HTML5 `srcSet` attribute for the image in WebP format (deprecated, it's better to use the [`auto=format`](https://docs.imgix.com/apis/rendering/auto/auto#format) Imgix transform instead) |
| aspectRatio | float   | :x:                | The aspect ratio (width/height) of the image                                                                                                                                                   |

## `<NakedImage />`

### Props

| prop             | type                     | default                            | required           | description                                                                                                                                          |
| ---------------- | ------------------------ | ---------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| data             | `ResponsiveImage` object |                                    | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query \*\*\*\*                                                                  |
| pictureClass     | string                   | null                               | :x:                | Additional CSS class for the root `<picture>` tag                                                                                                    |
| pictureStyle     | CSS properties           | null                               | :x:                | Additional CSS rules to add to the root `<picture>` tag                                                                                              |
| imgClass         | string                   | null                               | :x:                | Additional CSS class for the `<img>` tag                                                                                                             |
| imgCtyle         | CSS properties           | null                               | :x:                | Additional CSS rules to add to the `<img>` tag                                                                                                       |
| priority         | Boolean                  | false                              | :x:                | Disables lazy loading, and sets the image [fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority) to "high" |
| sizes            | string                   | undefined                          | :x:                | The HTML5 [`sizes`](https://web.dev/learn/design/responsive-images/#sizes) attribute for the image (will be used `data.sizes` as a fallback)         |
| usePlaceholder   | Boolean                  | true                               | :x:                | Whether the image should use a blurred image placeholder                                                                                             |
| srcSetCandidates | Array<number>            | [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] | :x:                | If `data` does not contain `srcSet`, the candidates for the `srcset` attribute of the image will be auto-generated based on these width multipliers  |
| referrerPolicy   | string                   | `no-referrer-when-downgrade`       | :x:                | Defines which referrer is sent when fetching the image. Defaults to `no-referrer-when-downgrade` to give more useful stats in DatoCMS Project Usages |

### Events

| prop  | description                                 |
| ----- | ------------------------------------------- |
| @load | Emitted when the image has finished loading |

## `<Image />`

### Props

| prop                  | type                                             | default                            | required           | description                                                                                                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------ | ---------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                  | `ResponsiveImage` object                         |                                    | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query.                                                                                                                                                                                                                   |
| class                 | string                                           | null                               | :x:                | Additional CSS class of root node                                                                                                                                                                                                                                                             |
| style                 | string                                           | null                               | :x:                | Additional CSS rules to add to the root node                                                                                                                                                                                                                                                  |
| pictureClass          | string                                           | null                               | :x:                | Additional CSS class for the inner `<picture />` tag                                                                                                                                                                                                                                          |
| pictureStyle          | string                                           | null                               | :x:                | Additional CSS rules to add to the inner `<picture />` tag                                                                                                                                                                                                                                    |
| imgClass              | string                                           | null                               | :x:                | Additional CSS class for the image inside the `<picture />` tag                                                                                                                                                                                                                               |
| imgStyle              | string                                           | null                               | :x:                | Additional CSS rules to add to the image inside the `<picture />` tag                                                                                                                                                                                                                         |
| layout                | 'intrinsic' \| 'fixed' \| 'responsive' \| 'fill' | "intrinsic"                        | :x:                | The layout behavior of the image as the viewport changes size                                                                                                                                                                                                                                 |
| fadeInDuration        | integer                                          | 500                                | :x:                | Duration (in ms) of the fade-in transition effect upoad image loading                                                                                                                                                                                                                         |
| intersectionThreshold | float                                            | 0                                  | :x:                | Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. |
| intersectionMargin    | string                                           | "0px 0px 0px 0px"                  | :x:                | Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections.                  |
| lazyLoad              | Boolean                                          | true                               | :x:                | Wheter enable lazy loading or not                                                                                                                                                                                                                                                             |
| explicitWidth         | Boolean                                          | false                              | :x:                | Wheter the image wrapper should explicitely declare the width of the image or keep it fluid                                                                                                                                                                                                   |
| objectFit             | String                                           | null                               | :x:                | Defines how the image will fit into its parent container when using layout="fill"                                                                                                                                                                                                             |
| objectPosition        | String                                           | null                               | :x:                | Defines how the image is positioned within its parent element when using layout="fill".                                                                                                                                                                                                       |
| priority              | Boolean                                          | false                              | :x:                | Disables lazy loading, and sets the image [fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority) to "high"                                                                                                                                          |
| srcSetCandidates      | Array<number>                                    | [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] | :x:                | If `data` does not contain `srcSet`, the candidates for the `srcset` attribute of the image will be auto-generated based on these width multipliers                                                                                                                                           |
| sizes                 | string                                           | undefined                          | :x:                | The HTML5 [`sizes`](https://web.dev/learn/design/responsive-images/#sizes) attribute for the image (will be used `data.sizes` as a fallback)                                                                                                                                                  |
| onLoad                | () => void                                       | undefined                          | :x:                | Function triggered when the image has finished loading                                                                                                                                                                                                                                        |
| usePlaceholder        | Boolean                                          | true                               | :x:                | Whether the component should use a blurred image placeholder                                                                                                                                                                                                                                  |
| referrerPolicy        | string                                           | `no-referrer-when-downgrade`       | :x:                | Defines which referrer is sent when fetching the image. Defaults to `no-referrer-when-downgrade` to give more useful stats in DatoCMS Project Usages                                                                                                                                          |

### Events

| prop  | description                                 |
| ----- | ------------------------------------------- |
| @load | Emitted when the image has finished loading |

---

### Layout mode

With the `layout` property, you can configure the behavior of the image as the viewport changes size:

- When `intrinsic`, the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports.
- When `fixed`, the image dimensions will not change as the viewport changes (no responsiveness) similar to the native `img` element.
- When `responsive` (default behaviour), the image will scale the dimensions down for smaller viewports and scale up for larger viewports.
- When `fill`, the image will stretch both width and height to the dimensions of the parent element, provided the parent element is relative.
  - This is usually paired with the `objectFit` and `objectPosition` properties.
  - Ensure the parent element has `position: relative` in their stylesheet.

### Intersection Observer

`IntersectionObserver` is the API used to determine if the image is inside the viewport or not. [Browser support is really good](https://caniuse.com/intersectionobserver): with Safari adding support in 12.1, all major browsers now support `IntersectionObserver` natively.

If `IntersectionObserver` object is not available, the component treats the image as it's always visible in the viewport. Feel free to add a [polyfill](https://www.npmjs.com/package/intersection-observer) so that it will also 100% work on older versions of iOS and IE11.
