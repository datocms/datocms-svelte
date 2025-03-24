# Structured text

`StructuredText />` is a Svelte component that you can use to render the value contained inside a DatoCMS [Structured Text field type](https://www.datocms.com/docs/structured-text/dast).

### Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Setup](#setup)
- [Basic usage](#basic-usage)
- [Customization](#customization)
  - [Custom components for blocks](#custom-components-for-blocks)
  - [Override default rendering of nodes](#override-default-rendering-of-nodes)
- [Props](#props)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### Setup

Import the component like this:

```js
import { StructuredText } from '@datocms/svelte';
```

## Basic usage

```svelte
<script>

import { onMount } from 'svelte';

import { StructuredText } from '@datocms/svelte';

const query = `
  query {
    blogPost {
      title
      content {
        value
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
    <StructuredText data={data.blogPost.content} />
  {/if}
</article>
```

## Customization

The `<StructuredText />` component comes with a set of default components that are use to render all the nodes present in [DatoCMS Dast trees](https://www.datocms.com/docs/structured-text/dast). These default components are enough to cover most of the simple cases.

You need to use custom components in the following cases:

- you have to render blocks, inline items or item links: there's no conventional way of rendering theses nodes, so you must create and pass custom components;
- you need to render a conventional node differently (e.g. you may want a custom render for blockquotes)

### Custom components for blocks

Here is an example using custom components for blocks, inline blocks, inline records and links to records. Take a look at the [test fixtures](https://github.com/datocms/datocms-svelte/tree/main/src/lib/components/StructuredText/__tests__/__fixtures__) to see examples on how to implement these components.

```svelte
<script>
import { onMount } from 'svelte';
import { executeQuery } from '@datocms/cda-client';

import { isBlock, isInlineItem, isItemLink } from 'datocms-structured-text-utils';

import { StructuredText } from '@datocms/svelte';

import Block from './Block.svelte';
import InlineItem from './InlineItem.svelte';
import ItemLink from './ItemLink.svelte';

const query = `
  query {
    blogPost {
      title
      content {
        value
        links {
          ... on RecordInterface {
            id
            __typename
          }
          ... on TeamMemberRecord {
            firstName
            slug
          }
        }
        blocks {
          ... on RecordInterface {
            id
            __typename
          }
          ... on CtaRecord {
            title
            url
          }
        }
        inlineBlocks {
          ... on RecordInterface {
            id
            __typename
          }
          ... on MentionRecord {
            username
          }
        }
      }
    }
  }
`;

export let data = null;

onMount(async () => {
  data = await executeQuery(query, { token: '<YOUR-API-TOKEN>' });
});

</script>

<article>
  {#if data}
    <h1>{{ data.blogPost.title }}</h1>
    <datocms-structured-text
      data={data.blogPost.content}
      components={[
        [isInlineItem, InlineItem],
        [isItemLink, ItemLink],
        [isBlock, Block]
        [isInlineBlock, InlineBlock]
      ]}
    />
  {/if}
</article>
```

### Override default rendering of nodes

`<StructuredText />` automatically renders all nodes (except for `inlineItem`, `itemLink`, `block` and `inlineBlock`) using a set of default components, that you might want to customize. For example:

- For `heading` nodes, you might want to add an anchor;
- For `code` nodes, you might want to use a custom syntax highlighting component;

In this case, you can easily override default rendering rules with the `components` props. See test fixtures for example implementations of custom components (e.g. [this special heading component](https://github.com/datocms/datocms-svelte/blob/main/src/lib/components/StructuredText/__tests__/__fixtures__/IncreasedLevelHeading.svelte)).

```svelte
<script>
	import { isHeading, isCode } from 'datocms-structured-text-utils';

	import Heading from './Heading.svelte';
	import Code from './Code.svelte';

	export let data;
</script>

<StructuredText
	data={data.blogPost.content}
	components={[
		[isHeading, Heading],
		[isCode, Code]
	]}
/>
```

## Props

| prop       | type                                                                                                        | required                                                                                | description                                                                                      | default |
| ---------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------- |
| data       | `StructuredText \| DastNode`                                                                                | :white_check_mark:                                                                      | The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from DatoCMS |         |
| components | [`PredicateComponentTuple[] \| null`](https://github.com/datocms/datocms-svelte/blob/main/src/lib/index.ts) | Only required if data contains `block`, `inlineBlock`, `inlineItem` or `itemLink` nodes | Array of tuples formed by a predicate function and custom component                              | `[]`    |
