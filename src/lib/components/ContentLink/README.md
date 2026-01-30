# ContentLink component for Visual Editing

`<ContentLink />` is a Svelte component that enables **Visual Editing** for your DatoCMS content. It provides click-to-edit overlays that allow editors to click on any content element on your website to instantly open the DatoCMS editor and modify that specific field.

This component is built on top of the [`@datocms/content-link`](https://www.npmjs.com/package/@datocms/content-link) library and provides a seamless integration for Svelte and SvelteKit projects.

## What is Visual Editing?

Visual Editing transforms how content editors interact with your website. Instead of navigating through forms and fields in a CMS, editors can:

1. **See their content in context** - Preview exactly how content appears on the live site
2. **Click to edit** - Click directly on any text, image, or field to open the editor
3. **Navigate seamlessly** - Jump between pages in the preview, and the CMS follows along
4. **Get instant feedback** - Changes in the CMS are reflected immediately in the preview

This drastically improves the editing experience, especially for non-technical users who can now edit content without understanding the underlying CMS structure.

## Out-of-the-box features

- **Click-to-edit overlays**: Visual indicators showing which content is editable
- **Stega decoding**: Automatically detects and decodes editing metadata embedded in content
- **Keyboard shortcuts**: Hold Alt/Option to temporarily enable editing mode
- **Flash-all highlighting**: Show all editable areas at once for quick orientation
- **Bidirectional navigation**: Sync navigation between preview and DatoCMS editor
- **Framework-agnostic**: Works with SvelteKit or any routing solution
- **StructuredText integration**: Special support for complex structured content fields
- **[Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) integration**: Seamless integration with DatoCMS's editing interface

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Basic Setup](#basic-setup)
  - [1. Fetch content with stega encoding](#1-fetch-content-with-stega-encoding)
  - [2. Add ContentLink component to your app](#2-add-contentlink-component-to-your-app)
- [SvelteKit integration](#sveltekit-integration)
- [Enabling click-to-edit](#enabling-click-to-edit)
- [Flash-all highlighting](#flash-all-highlighting)
- [Props](#props)
  - [ClickToEditOptions](#clicktoeditoptions)
- [Data attributes reference](#data-attributes-reference)
  - [Developer-specified attributes](#developer-specified-attributes)
    - [`data-datocms-content-link-url`](#data-datocms-content-link-url)
    - [`data-datocms-content-link-source`](#data-datocms-content-link-source)
    - [`data-datocms-content-link-group`](#data-datocms-content-link-group)
    - [`data-datocms-content-link-boundary`](#data-datocms-content-link-boundary)
  - [Library-managed attributes](#library-managed-attributes)
    - [`data-datocms-contains-stega`](#data-datocms-contains-stega)
    - [`data-datocms-auto-content-link-url`](#data-datocms-auto-content-link-url)
- [How group and boundary resolution works](#how-group-and-boundary-resolution-works)
- [Structured Text fields](#structured-text-fields)
  - [Rule 1: Always wrap the Structured Text component in a group](#rule-1-always-wrap-the-structured-text-component-in-a-group)
  - [Rule 2: Wrap embedded blocks, inline blocks, and inline records in a boundary](#rule-2-wrap-embedded-blocks-inline-blocks-and-inline-records-in-a-boundary)
- [Low-level utilities](#low-level-utilities)
  - [`decodeStega`](#decodestega)
  - [`stripStega`](#stripstega)
- [Troubleshooting](#troubleshooting)
  - [Click-to-edit overlays not appearing](#click-to-edit-overlays-not-appearing)
  - [Navigation not syncing with Web Previews plugin](#navigation-not-syncing-with-web-previews-plugin)
  - [StructuredText blocks not clickable](#structuredtext-blocks-not-clickable)
  - [Layout issues caused by stega encoding](#layout-issues-caused-by-stega-encoding)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```bash
npm install --save @datocms/svelte
```

The package includes `@datocms/content-link` as a dependency, which provides the underlying controller for Visual Editing functionality.

## Basic Setup

Visual Editing requires two steps:

### 1. Fetch content with stega encoding

When fetching content from DatoCMS, enable stega encoding to embed editing metadata:

```js
import { executeQuery } from '@datocms/cda-client';

const query = `
  query {
    page {
      title
      content
    }
  }
`;

const result = await executeQuery(query, {
  token: 'YOUR_API_TOKEN',
  environment: 'main',
  // Enable stega encoding
  contentLink: 'v1',
  // Set your site's base URL for editing links
  baseEditingUrl: 'https://your-project.admin.datocms.com',
});
```

The `contentLink: 'v1'` option enables stega encoding, which embeds invisible metadata into text fields. The `baseEditingUrl` tells DatoCMS where your project is located so edit URLs can be generated correctly. Both options are required.

### 2. Add ContentLink component to your app

Add the `<ContentLink />` component to your app. It doesn't render any visible output but sets up the click-to-edit functionality:

```svelte
<script>
  import { ContentLink } from '@datocms/svelte';
</script>

<ContentLink />

<!-- Your content here -->
```

That's it! The component will automatically detect editable content and create interactive overlays.

## SvelteKit integration

For SvelteKit projects, you can integrate with the routing system to enable full Web Previews plugin support:

```svelte
<script>
  import { ContentLink } from '@datocms/svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
</script>

<ContentLink
  onNavigateTo={(path) => goto(path)}
  currentPath={$page.url.pathname}
/>

<!-- Your content here -->
```

This integration enables:
- **Navigation from plugin**: When editors navigate to a different URL in the Visual Editing mode, your preview updates accordingly
- **Current path sync**: The plugin knows which page is currently being previewed

## Enabling click-to-edit

Click-to-edit overlays are **not enabled by default**. Instead, editors can:

- **Hold Alt/Option key**: Temporarily enable click-to-edit mode while the key is held down
- **Release the key**: Disable click-to-edit mode when released

If you prefer to enable click-to-edit programmatically on mount, set the `enableClickToEdit` prop:

```svelte
<ContentLink enableClickToEdit={true} />
```

Or with options:

```svelte
<ContentLink enableClickToEdit={{ scrollToNearestTarget: true }} />
<ContentLink enableClickToEdit={{ hoverOnly: true }} />
<ContentLink enableClickToEdit={{ hoverOnly: true, scrollToNearestTarget: true }} />
```

The `hoverOnly` option is useful to avoid showing overlays on touch devices where they may interfere with normal scrolling and tapping behavior. When set to `true` on a touch-only device, click-to-edit will not be automatically enabled, but users can still toggle it manually using the Alt/Option key.

## Flash-all highlighting

The flash-all feature provides visual feedback by highlighting all editable elements on the page. This is useful for:
- Showing editors what content they can edit
- Debugging to verify Visual Editing is working correctly
- Onboarding new content editors

When you enable click-to-edit with the `scrollToNearestTarget` option, it triggers the flash-all effect:

```svelte
<ContentLink enableClickToEdit={{ scrollToNearestTarget: true }} />
```

The `scrollToNearestTarget` parameter scrolls to the nearest editable element, useful on long pages.

## Props

| Prop                | Type                            | Default | Description                                                                                                                                            |
| ------------------- | ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onNavigateTo`      | `(path: string) => void`        | -       | Callback when [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) requests navigation to a different page |
| `currentPath`       | `string`                        | -       | Current pathname to sync with [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews)                         |
| `enableClickToEdit` | `boolean \| ClickToEditOptions` | -       | Enable click-to-edit overlays on mount. Pass `true` or an object with options. If undefined or false, click-to-edit is disabled                        |
| `stripStega`        | `boolean`                       | -       | Whether to strip stega encoding from text nodes after stamping                                                                                         |
| `root`              | `ParentNode`                    | -       | Root element to limit scanning to instead of the entire document                                                                                       |

### ClickToEditOptions

When passing an object to `enableClickToEdit`, the following options are available:

| Option                  | Type      | Default | Description                                                                                                                                                                                                    |
| ----------------------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scrollToNearestTarget` | `boolean` | `false` | Automatically scroll to the nearest editable element if none is currently visible in the viewport when click-to-edit mode is enabled. Also triggers the flash-all highlighting effect.                         |
| `hoverOnly`             | `boolean` | `false` | Only enable click-to-edit on devices that support hover (non-touch devices). Uses `window.matchMedia('(hover: hover)')` to detect hover capability. Useful to avoid overlays interfering with touch scrolling. |

## Data attributes reference

This library uses several `data-datocms-*` attributes. Some are **developer-specified** (you add them to your markup), and some are **library-managed** (added automatically during DOM stamping). Here's a complete reference.

### Developer-specified attributes

These attributes are added by you in your templates/components to control how editable regions behave.

#### `data-datocms-content-link-url`

Manually marks an element as editable with an explicit edit URL. Use this for non-text fields (booleans, numbers, dates, JSON) that cannot contain stega encoding. The recommended approach is to use the `_editingUrl` field available on all records:

```graphql
query {
  product {
    id
    price
    isActive
    _editingUrl
  }
}
```

```svelte
<span data-datocms-content-link-url={product._editingUrl}>
  ${product.price}
</span>
```

#### `data-datocms-content-link-source`

Attaches stega-encoded metadata without the need to render it as content. Useful for structural elements that cannot contain text (like `<video>`, `<audio>`, `<iframe>`, etc.) or when stega encoding in visible text would be problematic:

```svelte
<div data-datocms-content-link-source={video.alt}>
  <video src={video.url} poster={video.posterImage.url} controls />
</div>
```

The value must be a stega-encoded string (any text field from the API will work). The library decodes the stega metadata from the attribute value and makes the element clickable to edit.

#### `data-datocms-content-link-group`

Expands the clickable area to a parent element. When the library encounters stega-encoded content, by default it makes the immediate parent of the text node clickable to edit. Adding this attribute to an ancestor makes that ancestor the clickable target instead:

```svelte
<article data-datocms-content-link-group>
  <!-- product.title contains stega encoding -->
  <h2>{product.title}</h2>
  <p>${product.price}</p>
</article>
```

Here, clicking anywhere in the `<article>` opens the editor, rather than requiring users to click precisely on the `<h2>`.

**Important:** A group should contain only one stega-encoded source. If multiple stega strings resolve to the same group, the library logs a collision warning and only the last URL wins.

#### `data-datocms-content-link-boundary`

Stops the upward DOM traversal that looks for a `data-datocms-content-link-group`, making the element where stega was found the clickable target instead. This creates an independent editable region that won't merge into a parent group (see [How group and boundary resolution works](#how-group-and-boundary-resolution-works) below for details):

```svelte
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <section data-datocms-content-link-boundary>
    <!-- page.author contains stega encoding → resolves to URL B -->
    <span>{page.author}</span>
  </section>
</div>
```

Without the boundary, clicking `page.author` would open URL A (the outer group). With the boundary, the `<span>` becomes the clickable target opening URL B.

The boundary can also be placed directly on the element that contains the stega text:

```svelte
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <!-- page.author contains stega encoding → resolves to URL B -->
  <span data-datocms-content-link-boundary>{page.author}</span>
</div>
```

Here, the `<span>` has the boundary and directly contains the stega text, so the `<span>` itself becomes the clickable target (since the starting element and the boundary element are the same).

### Library-managed attributes

These attributes are added automatically by the library during DOM stamping. You do not need to add them yourself, but you can target them in CSS or JavaScript.

#### `data-datocms-contains-stega`

Added to elements whose text content contains stega-encoded invisible characters. This attribute is only present when `stripStega` is `false` (the default), since with `stripStega: true` the characters are removed entirely. Useful for CSS workarounds — the zero-width characters can sometimes cause unexpected letter-spacing or text overflow:

```css
[data-datocms-contains-stega] {
  letter-spacing: 0 !important;
}
```

#### `data-datocms-auto-content-link-url`

Added automatically to elements that the library has identified as editable targets (through stega decoding and group/boundary resolution). Contains the resolved edit URL.

This is the automatic counterpart to the developer-specified `data-datocms-content-link-url`. The library adds `data-datocms-auto-content-link-url` wherever it can extract an edit URL from stega encoding, while `data-datocms-content-link-url` is needed for non-text fields (booleans, numbers, dates, etc.) where stega encoding cannot be embedded. Both attributes are used by the click-to-edit overlay system to determine which elements are clickable and where they link to.

## How group and boundary resolution works

When the library encounters stega-encoded content inside an element, it walks up the DOM tree from that element:

1. If it finds a `data-datocms-content-link-group`, it stops and stamps **that** element as the clickable target.
2. If it finds a `data-datocms-content-link-boundary`, it stops and stamps the **starting element** as the clickable target — further traversal is prevented.
3. If it reaches the root without finding either, it stamps the **starting element**.

Here are some concrete examples to illustrate:

**Example 1: Nested groups**

```svelte
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <div data-datocms-content-link-group>
    <!-- page.subtitle contains stega encoding → resolves to URL B -->
    <p>{page.subtitle}</p>
  </div>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.subtitle`**: walks up from `<p>`, finds the inner group first → the **inner `<div>`** becomes clickable (opens URL B). The outer group is never reached.

Each nested group creates an independent clickable region. The innermost group always wins for its own content.

**Example 2: Boundary preventing group propagation**

```svelte
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{page.title}</h1>
  <section data-datocms-content-link-boundary>
    <!-- page.author contains stega encoding → resolves to URL B -->
    <span>{page.author}</span>
  </section>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.author`**: walks up from `<span>`, hits the `<section>` boundary → traversal stops, the **`<span>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 3: Boundary inside a group**

```svelte
<div data-datocms-content-link-group>
  <!-- page.description contains stega encoding → resolves to URL A -->
  <p>{page.description}</p>
  <div data-datocms-content-link-boundary>
    <!-- page.footnote contains stega encoding → resolves to URL B -->
    <p>{page.footnote}</p>
  </div>
</div>
```

- **`page.description`**: walks up from `<p>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.footnote`**: walks up from `<p>`, hits the boundary → traversal stops, the **`<p>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 4: Multiple stega strings without groups (collision warning)**

```svelte
<p>
  <!-- Both product.name and product.tagline contain stega encoding -->
  {product.name}
  {product.tagline}
</p>
```

Both stega-encoded strings resolve to the same `<p>` element. The library logs a console warning and the last URL wins. To fix this, wrap each piece of content in its own element:

```svelte
<p>
  <span>{product.name}</span>
  <span>{product.tagline}</span>
</p>
```

## Structured Text fields

Structured Text fields require special attention because of how stega encoding works within them:

- The DatoCMS API encodes stega information inside a single `<span>` within the structured text output. Without any configuration, only that small span would be clickable.
- Structured Text fields can contain **embedded blocks** and **inline records**, each with their own editing URL that should open a different record in the editor.

Here are the rules to follow:

### Rule 1: Always wrap the Structured Text component in a group

This makes the entire structured text area clickable, instead of just the tiny stega-encoded span:

```svelte
<div data-datocms-content-link-group>
  <StructuredText data={page.content} />
</div>
```

### Rule 2: Wrap embedded blocks, inline blocks, and inline records in a boundary

Embedded blocks, inline blocks, and inline records each have their own edit URL (pointing to the block/record). Without a boundary, clicking them would bubble up to the parent group and open the structured text field editor instead. Add `data-datocms-content-link-boundary` to the root element of your custom components to prevent them from merging into the parent group.

**Note on record links (item links):** Record links (`isItemLink`) typically do **not** need a boundary. They render as `<a>` tags wrapping text that already belongs to the surrounding structured text. Unlike embedded blocks or inline records, record links don't introduce a separate editing target with its own stega-encoded URL, so there's no URL collision and no reason to isolate them from the parent group. When an editor clicks on that text, it correctly opens the structured text field editor (the parent group). Only add a boundary to a record link if you specifically want clicking it to open the linked record's editor instead.

```svelte
<script>
  import { StructuredText } from '@datocms/svelte';
  import { isBlock, isInlineBlock, isInlineItem, isItemLink } from 'datocms-structured-text-utils';
  import Block from './Block.svelte';
  import InlineBlock from './InlineBlock.svelte';
  import InlineItem from './InlineItem.svelte';
  import ItemLink from './ItemLink.svelte';
</script>

<div data-datocms-content-link-group>
  <StructuredText
    data={page.content}
    components={[
      [isBlock, Block],
      [isInlineBlock, InlineBlock],
      [isInlineItem, InlineItem],
      [isItemLink, ItemLink],
    ]}
  />
</div>
```

Then, in your custom components, wrap the root element with `data-datocms-content-link-boundary`:

```svelte
<!-- Block.svelte -->
<script>
  export let block;
</script>

<div data-datocms-content-link-boundary>
  <h2>{block.title}</h2>
  <p>{block.description}</p>
</div>
```

```svelte
<!-- InlineBlock.svelte -->
<script>
  export let block;
</script>

<span data-datocms-content-link-boundary>
  <em>{block.username}</em>
</span>
```

```svelte
<!-- InlineItem.svelte -->
<script>
  export let link;
</script>

<span data-datocms-content-link-boundary>
  {link.title}
</span>
```

Record links don't need a boundary — their content belongs to the surrounding structured text:

```svelte
<!-- ItemLink.svelte -->
<script>
  export let link;
</script>

<a href={`/posts/${link.slug}`}>
  <slot />
</a>
```

With this setup:
- Clicking the main text (paragraphs, headings, lists) — including record links — opens the **structured text field editor**
- Clicking an embedded block, inline block, or inline record opens **that record's editor**

## Low-level utilities

The `@datocms/svelte` package re-exports utility functions from `@datocms/content-link` for working with stega-encoded content:

### `decodeStega`

Decodes stega-encoded content to extract editing metadata:

```typescript
import { decodeStega } from '@datocms/svelte';

const text = "Hello, world!"; // Contains invisible stega data
const decoded = decodeStega(text);

if (decoded) {
  console.log('Editing URL:', decoded.url);
  console.log('Clean text:', decoded.cleanText);
}
```

### `stripStega`

Removes stega encoding from any data type:

```typescript
import { stripStega } from '@datocms/svelte';

// Works with strings
stripStega("Hello‎World") // "HelloWorld"

// Works with objects
stripStega({ name: "John‎", age: 30 })

// Works with nested structures - removes ALL stega encodings
stripStega({
  users: [
    { name: "Alice‎", email: "alice‎.com" },
    { name: "Bob‎", email: "bob‎.co" }
  ]
})

// Works with arrays
stripStega(["First‎", "Second‎", "Third‎"])
```

These utilities are useful when you need to:
- Extract clean text for meta tags or social sharing
- Check if content has stega encoding
- Debug Visual Editing issues
- Process stega-encoded content programmatically

## Troubleshooting

### Click-to-edit overlays not appearing

**Problem**: Overlays don't appear when clicking on content.

**Solutions**:
1. Verify stega encoding is enabled in your API calls:
   ```js
   const result = await executeQuery(query, {
     token: 'YOUR_API_TOKEN',
     contentLink: 'v1',
     baseEditingUrl: 'https://your-project.admin.datocms.com',
   });
   ```

2. Check that `<ContentLink />` is mounted in your component tree

3. Ensure you've enabled click-to-edit mode:
   ```svelte
   <ContentLink enableClickToEdit={true} />
   ```
   Or hold Alt/Option key while browsing

4. Check browser console for errors

### Navigation not syncing with Web Previews plugin

**Problem**: When you navigate in your preview, the DatoCMS editor doesn't follow along.

**Solutions**:
1. Ensure you're providing both `onNavigateTo` and `currentPath` props:
   ```svelte
   <ContentLink
     onNavigateTo={(path) => goto(path)}
     currentPath={$page.url.pathname}
   />
   ```

2. Verify `currentPath` updates when navigation occurs

3. Check that `baseEditingUrl` in your API calls matches your preview URL

### StructuredText blocks not clickable

**Problem**: Content within StructuredText blocks doesn't have click-to-edit overlays.

**Solutions**:
1. Wrap StructuredText with `data-datocms-content-link-group`:
   ```svelte
   <div data-datocms-content-link-group>
     <StructuredText data={content} />
   </div>
   ```

2. Add `data-datocms-content-link-boundary` to custom blocks, inline blocks, and inline records to prevent them from bubbling to the parent field (record links typically don't need a boundary)

### Layout issues caused by stega encoding

**Problem**: The invisible zero-width characters can cause unexpected letter-spacing or text breaking out of containers.

**Solutions**:
1. Use the `stripStega` prop to remove stega encoding after processing:
   ```svelte
   <ContentLink stripStega={true} />
   ```

2. Use CSS to reset letter-spacing on elements with stega-encoded content:
   ```css
   [data-datocms-contains-stega] {
     letter-spacing: 0 !important;
   }
   ```
   This attribute is automatically added to elements with stega-encoded content when `stripStega: false` (the default)
