<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

<!--datocms-autoinclude-header end-->

# @datocms/svelte

![MIT](https://img.shields.io/npm/l/@datocms/svelte?style=for-the-badge) ![NPM](https://img.shields.io/npm/v/@datocms/svelte?style=for-the-badge) [![Build Status](https://img.shields.io/github/actions/workflow/status/datocms/datocms-svelte/node.js.yml?branch=main&style=for-the-badge)](https://github.com/datocms/datocms-svelte/actions/workflows/node.js.yml)

A set of components to work faster with [DatoCMS](https://www.datocms.com/) in Svelte projects.

- Works with Svelte and SvelteKit;
- Written in TypeScript;
- Usable both client and server side;

### Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Features](#features)
  - [Installation](#installation)
  - [Development](#development)
  - [Building](#building)
- [What is DatoCMS?](#what-is-datocms)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

`@datocms/svelte` contains ready-to-use Svelte components and usage examples.

Components:

- [`<ContentLink />` for Visual Editing with click-to-edit overlays](src/lib/components/ContentLink)
- [`<Image />` and `<NakedImage />`](src/lib/components/Image)
- [`<VideoPlayer />`](src/lib/components/VideoPlayer)
- [`<StructuredText />`](src/lib/components/StructuredText)
- [`<Head />`](src/lib/components/Head)

Stores:

- [`querySubscription`](src/lib/stores/querySubscription)

## Installation

```
npm install @datocms/svelte
```

## Development

This repository contains some examples in the `app/routes` folder. You can use them to locally test your changes to the package:

```bash
npm run dev
```

## Building

To create a production version of this library:

```bash
npm run build
```

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
