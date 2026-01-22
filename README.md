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

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agencies, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Why DatoCMS?**

- **API-First Architecture**: Built for both REST and GraphQL, enabling flexible content delivery
- **Just Enough Features**: We believe in keeping things simple, and giving you [the right feature-set tools](https://www.datocms.com/features) to get the job done
- **Developer Experience**: First-class TypeScript support with powerful developer tools

**Getting Started:**

- ⚡️ [Create Free Account](https://dashboard.datocms.com/signup) - Get started with DatoCMS in minutes
- 🔖 [Documentation](https://www.datocms.com/docs) - Comprehensive guides and API references
- ⚙️ [Community Support](https://community.datocms.com/) - Get help from our team and community
- 🆕 [Changelog](https://www.datocms.com/product-updates) - Latest features and improvements

**Official Libraries:**

- [**Content Delivery Client**](https://github.com/datocms/cda-client) - TypeScript GraphQL client for content fetching
- [**REST API Clients**](https://github.com/datocms/js-rest-api-clients) - Node.js/Browser clients for content management
- [**CLI Tools**](https://github.com/datocms/cli) - Command-line utilities for schema migrations (includes [Contentful](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [WordPress](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress) importers)

**Official Framework Integrations**

Helpers to manage SEO, images, video and Structured Text coming from your DatoCMS projects:

- [**React Components**](https://github.com/datocms/react-datocms)
- [**Vue Components**](https://github.com/datocms/vue-datocms)
- [**Svelte Components**](https://github.com/datocms/datocms-svelte)
- [**Astro Components**](https://github.com/datocms/astro-datocms)

**Additional Resources:**

- [**Plugin Examples**](https://github.com/datocms/plugins) - Example plugins we've made that extend the editor/admin dashboard
- [**Starter Projects**](https://www.datocms.com/marketplace/starters) - Example website implementations for popular frameworks
- [**All Public Repositories**](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)

<!--datocms-autoinclude-footer end-->
