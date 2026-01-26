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
- [StructuredText integration](#structuredtext-integration)
  - [Edit groups with `data-datocms-content-link-group`](#edit-groups-with-data-datocms-content-link-group)
  - [Edit boundaries with `data-datocms-content-link-boundary`](#edit-boundaries-with-data-datocms-content-link-boundary)
- [Manual overlays](#manual-overlays)
  - [Using `data-datocms-content-link-url`](#using-data-datocms-content-link-url)
  - [Using `data-datocms-content-link-source`](#using-data-datocms-content-link-source)
- [Low-level utilities](#low-level-utilities)
  - [`decodeStega`](#decodestega)
  - [`stripStega`](#stripstega)
- [Troubleshooting](#troubleshooting)
  - [Click-to-edit overlays not appearing](#click-to-edit-overlays-not-appearing)
  - [Navigation not syncing with Web Previews plugin](#navigation-not-syncing-with-web-previews-plugin)
  - [StructuredText blocks not clickable](#structuredtext-blocks-not-clickable)

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

| Prop                | Type                                      | Default | Description                                                                                                                                            |
| ------------------- | ----------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onNavigateTo`      | `(path: string) => void`                  | -       | Callback when [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) requests navigation to a different page |
| `currentPath`       | `string`                                  | -       | Current pathname to sync with [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews)                         |
| `enableClickToEdit` | `boolean \| ClickToEditOptions` | -       | Enable click-to-edit overlays on mount. Pass `true` or an object with options. If undefined or false, click-to-edit is disabled                                |
| `stripStega`        | `boolean`                                 | -       | Whether to strip stega encoding from text nodes after stamping                                                                                         |
| `root`              | `ParentNode`                              | -       | Root element to limit scanning to instead of the entire document                                                                                       |

### ClickToEditOptions

When passing an object to `enableClickToEdit`, the following options are available:

| Option                  | Type      | Default | Description                                                                                                                                                                                                     |
| ----------------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scrollToNearestTarget` | `boolean` | `false` | Automatically scroll to the nearest editable element if none is currently visible in the viewport when click-to-edit mode is enabled. Also triggers the flash-all highlighting effect.                         |
| `hoverOnly`             | `boolean` | `false` | Only enable click-to-edit on devices that support hover (non-touch devices). Uses `window.matchMedia('(hover: hover)')` to detect hover capability. Useful to avoid overlays interfering with touch scrolling. |

## StructuredText integration

When rendering Structured Text fields, you'll want to make the entire structured text area clickable rather than just specific spans. DatoCMS provides special HTML attributes to control this behavior.

### Edit groups with `data-datocms-content-link-group`

Wrap your StructuredText component with a container that has the `data-datocms-content-link-group` attribute. This makes the entire area clickable to edit the structured text field:

```svelte
<script>
  import { StructuredText } from '@datocms/svelte';
</script>

<div data-datocms-content-link-group>
  <StructuredText data={content.structuredTextField} />
</div>
```

This allows editors to click anywhere within the structured text content to edit it, rather than targeting small span elements.

### Edit boundaries with `data-datocms-content-link-boundary`

When your Structured Text contains embedded blocks, you'll want those blocks to open their own specific record editor instead of the structured text field editor. Use the `data-datocms-content-link-boundary` attribute to stop the upward traversal:

```svelte
<script>
  import { StructuredText } from '@datocms/svelte';
  import BlockComponent from './BlockComponent.svelte';
</script>

<div data-datocms-content-link-group>
  <StructuredText
    data={content.structuredTextField}
    blocks={{
      // Render custom blocks
      myBlock: (props) => ({
        component: BlockComponent,
        props: {
          block: props.record,
          // Wrap the block with a boundary
          useBoundary: true,
        }
      })
    }}
  />
</div>

<!-- In BlockComponent.svelte -->
<div data-datocms-content-link-boundary>
  <h2>{block.title}</h2>
  <p>{block.description}</p>
</div>
```

In this example:
- Clicking on the main structured text content opens the structured text field editor
- Clicking on an embedded block opens that specific block's record editor

## Manual overlays

In some cases, you may want to manually create click-to-edit overlays for content that doesn't have stega encoding.

### Using `data-datocms-content-link-url`

You can add the `data-datocms-content-link-url` attribute with a DatoCMS editing URL:

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

<span data-datocms-content-link-url={product._editingUrl}>
  {product.isActive ? 'Active' : 'Inactive'}
</span>
```

### Using `data-datocms-content-link-source`

For elements without visible stega-encoded content, use the [`data-datocms-content-link-source`](https://github.com/datocms/content-link?tab=readme-ov-file#stamping-elements-via-data-datocms-content-link-source) attribute to attach stega metadata directly:

```svelte
<!-- product.asset.video.alt contains stega-encoded info -->
<video
  src={product.asset.video.url}
  data-datocms-content-link-source={product.asset.video.alt}
  controls
/>
```

This is useful for structural elements like `<video>`, `<audio>`, or `<iframe>` where stega encoding in visible text would be problematic.

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

2. Add `data-datocms-content-link-boundary` to custom blocks to prevent them from bubbling to the parent field
