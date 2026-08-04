# Live real-time updates

`querySubscription` returns a Svelte store that you can use to implement client-side updates of the page as soon as the content changes. It uses DatoCMS's [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api/api-reference) to receive the updated query results in real-time, and is able to reconnect in case of network failures.

Live updates are great both to get instant previews of your content while editing it inside DatoCMS, or to offer real-time updates of content to your visitors (ie. news site).

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Reference](#reference)
- [Initialization options](#initialization-options)
- [Disabling the subscription](#disabling-the-subscription)
- [Connection status](#connection-status)
- [Error object](#error-object)
- [Example](#example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Reference

Import `querySubscription` from `@datocms/svelte` and use it inside your components like this:

```js
import { querySubscription } from '@datocms/svelte';

const subscription = querySubscription(options: Options);
```

## Initialization options

| prop               | type                                                                                       | required           | description                                                                                      | default                              |
| ------------------ | ------------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------ |
| enabled            | boolean                                                                                    | :x:                | Whether the subscription has to be performed or not (see [Disabling the subscription](#disabling-the-subscription)) | true                                 |
| query              | string \| [`TypedDocumentNode`](https://github.com/dotansimha/graphql-typed-document-node) | :white_check_mark: | The GraphQL query to subscribe                                                                   |                                      |
| token              | string                                                                                     | :white_check_mark: | DatoCMS API token to use                                                                         |                                      |
| variables          | Object                                                                                     | :x:                | GraphQL variables for the query                                                                  |                                      |
| includeDrafts      | boolean                                                                                    | :x:                | If true, draft records will be returned                                                          |                                      |
| excludeInvalid     | boolean                                                                                    | :x:                | If true, invalid records will be filtered out                                                    |                                      |
| environment        | string                                                                                     | :x:                | The name of the DatoCMS environment where to perform the query (defaults to primary environment) |                                      |
| contentLink        | `'v1'`                                                                                     | :x:                | If set, embed metadata that enable [Content Link](https://www.datocms.com/docs/content-delivery-api/api-endpoints#content-link) |                                      |
| baseEditingUrl     | string                                                                                     | :x:                | The base URL of the DatoCMS project                                                              |                                      |
| cacheTags          | boolean                                                                                    | :x:                | If true, receive the Cache Tags associated with the query                                        |                                      |
| initialData        | Object                                                                                     | :x:                | The initial data to use on the first render                                                      |                                      |
| reconnectionPeriod | number                                                                                     | :x:                | In case of network errors, the period (in ms) to wait to reconnect                               | 1000                                 |
| fetcher            | a [fetch-like function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)        | :x:                | The fetch function to use to perform the registration query                                      | window.fetch                         |
| eventSourceClass   | an [EventSource-like](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) class  | :x:                | The EventSource class to use to open up the SSE connection                                       | window.EventSource                   |
| baseUrl            | string                                                                                     | :x:                | The base URL to use to perform the query                                                         | `https://graphql-listen.datocms.com` |

## Disabling the subscription

Real-time updates are usually only wanted in a specific context — say, when Draft Mode is active — while regular visitors should just get the content that was fetched on the server. Instead of conditionally calling the store (which you cannot do: `querySubscription` calls `onMount`, so it must be invoked unconditionally during component initialization), pass `enabled: false`:

```js
const subscription = querySubscription({
  enabled: false,
  initialData: data.page // returned by your `load` function
});
```

When `enabled` is `false`:

- no connection is ever opened, and no API token is needed;
- the store emits `initialData` as its `data`, and `closed` as its `status`;
- every other option becomes optional. TypeScript enforces this: `QuerySubscriptionOptions` is a union of `EnabledQuerySubscriptionOptions` (where `query` and `token` are required) and `DisabledQuerySubscriptionOptions` (where they are not), so a disabled subscription type-checks with `initialData` alone.

This is what lets a single component render both the static and the live version of a page, toggling one boolean.

## Connection status

The `status` property represents the state of the server-sent events connection. It can be one of the following:

- `connecting`: the subscription channel is trying to connect
- `connected`: the channel is open, we're receiving live updates
- `closed`: the channel is not open. Either it has been permanently closed due to a fatal error (ie. an invalid query), or the subscription was never started because `enabled` is `false`

## Error object

| prop     | type   | description                                             |
| -------- | ------ | ------------------------------------------------------- |
| code     | string | The code of the error (ie. `INVALID_QUERY`)             |
| message  | string | An human friendly message explaining the error          |
| response | Object | The raw response returned by the endpoint, if available |

## Example

```svelte
<script>
  import { querySubscription } from '@datocms/svelte';

  const subscription = querySubscription({
    enabled: true,
    query: `
      query AppQuery($first: IntType) {
        allBlogPosts(first: $first) {
          slug
          title
        }
      }`,
    variables: { first: 10 },
    token: 'YOUR_API_TOKEN',
  });

  $: ({ data, error, status } = $subscription);

  const statusMessage = {
    connecting: 'Connecting to DatoCMS...',
    connected: 'Connected to DatoCMS, receiving live updates!',
    closed: 'Connection closed',
  };
</script>

<p>Connection status: {statusMessage[status]}</p>

{#if error}
  <h1>Error: {error.code}</h1>
  <p>{error.message}</p>
  {#if error.response}
    <pre>{JSON.stringify(error.response, null, 2)}</pre>
  {/if}
{/if}

{#if data}
  <ul>
    {#each data.allBlogPosts as blogPost (blogPost.slug)}
      <li>{blogPost.title}</li>
    {/each}
  </ul>
{/if}
```

For a complete, production-style setup, see the [DatoCMS SvelteKit Starter Kit](https://github.com/datocms/sveltekit-starter-kit), which wires `querySubscription` into a draft-mode / [Visual Editing](https://www.datocms.com/docs/visual-editing) flow:

- **[`src/lib/datocms/queries.ts`](https://github.com/datocms/sveltekit-starter-kit/blob/main/src/lib/datocms/queries.ts)** — the `generateRealtimeSubscription()` helper returns the `QuerySubscriptionOptions` object this store consumes: it fetches `initialData` with `executeQuery`, switches between the published and draft CDA tokens, and only sets `enabled: true` (with `contentLink: 'v1'`) when Draft Mode is active.
- **[`src/routes/page/[slug]/+page.server.ts`](https://github.com/datocms/sveltekit-starter-kit/blob/main/src/routes/page/%5Bslug%5D/+page.server.ts)** — the `load` function composes the typed GraphQL query and returns `generateRealtimeSubscription(event, query, { slug })` as `data.subscription`.
- **[`src/routes/page/[slug]/+page.svelte`](https://github.com/datocms/sveltekit-starter-kit/blob/main/src/routes/page/%5Bslug%5D/+page.svelte)** — the component calls `querySubscription(data.subscription)` and renders from `$subscription.data` (the site-wide [`+layout.svelte`](https://github.com/datocms/sveltekit-starter-kit/blob/main/src/routes/+layout.svelte) uses the same pattern).
