# `<VideoPlayer/>` component for easy video integration.

`<VideoPlayer />` is a Svelte component specially designed to work seamlessly
with DatoCMS’s [`video` GraphQL
query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#videos)
that optimizes video streaming for your sites.

To stream videos, DatoCMS partners with MUX, a video CDN that serves optimized
streams to your users. Our component is a wrapper around [MUX's video
player](https://github.com/muxinc/elements/blob/main/packages/mux-player/README.md)
[web
component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). It
takes care of the details for you, and this is our recommended way to serve
optimal videos to your users.

## Out-of-the-box features

- Offers optimized streaming so smartphones and tablets don’t request desktop-sized videos
- Lazy loads the underlying video player web component and the video to be
  played to speed initial page load and save bandwidth
- Holds the video position so your page doesn’t jump while the player loads
- Uses blur-up technique to show a placeholder of the video while it loads

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [Props](#props)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```sh {"id":"01HP46D8MDP5Y76HY788MWNDMX"}
npm install --save @datocms/svelte @mux/mux-player
```

`@mux/mux-player` is a [peer dependency](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies) for `@datocms/svelte`: so you're expected to add it to your project.

## Usage

1. Import `VideoPlayer` from `@datocms/svelte` and use it in your app
2. Write a GraphQL query to your DatoCMS project using the [`video` query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#videos)

The GraphQL query returns data that the `VideoPlayer` component automatically uses to properly size the player, set up a “blur-up” placeholder as well as lazy loading the video.

## Example

```svelte {"id":"01HP46D8MDP5Y76HY78BNPWHB2"}
<script>

import { onMount } from 'svelte';

import { VideoPlayer } from '@datocms/svelte';

const query = gql`
  query {
    blogPost {
      title
      cover {
        video {
          # required: this field identifies the video to be played
          muxPlaybackId

          # all the other fields are not required but:

          # if provided, title is displayed in the upper left corner of the video
          title

          # if provided, width and height are used to define the aspect ratio of the
          # player, so to avoid layout jumps during the rendering.
          width
          height

          # if provided, it shows a blurred placeholder for the video
          blurUpThumb

          # you can include more data here: they will be ignored by the component
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

<article>
  {#if data}
    <h1>{{ data.blogPost.title }}</h1>
    <VideoPlayer data={data.blogPost.cover.video} />
  {/if}
</article>
```

## Props

The `<VideoPlayer />` component supports as props all the [attributes](https://github.com/muxinc/elements/blob/main/packages/mux-player/REFERENCE.md)
of the `<mux-player />` web component, plus
`data`, which is meant to receive data directly in the shape they are provided
by DatoCMS GraphQL API.

`<VideoPlayer />` uses the `data` prop to generate a set of attributes for the
inner `<mux-player />`.

| prop | type           | required           | description                                                      | default |
| ---- | -------------- | ------------------ | ---------------------------------------------------------------- | ------- |
| data | `Video` object | :white_check_mark: | The actual response you get from a DatoCMS `video` GraphQL query |         |

`<VideoPlayer />` generate some default attributes:

- when not declared, the `disableCookies` prop is true, unless you explicitly
  set the prop to `false` (therefore it generates a `disable-cookies` attribute)
- `preload` defaults to `metadata`, for an optimal UX experience together with saved bandwidth
- the video height and width, when available in the `data` props, are used to
  set a default `aspect-ratio: [width] / [height];` for the `<mux-player />`'s
  `style` attribute

All the other props are forwarded to the `<mux-player />` web component that is used internally.
