# @datocms/svelte

![MIT](https://img.shields.io/npm/l/@datocms/svelte?style=for-the-badge) ![NPM](https://img.shields.io/npm/v/@datocms/svelte?style=for-the-badge) [![Build Status](https://img.shields.io/github/actions/workflow/status/datocms/datocms-svelte/node.js.yml?branch=main&style=for-the-badge)](https://github.com/datocms/datocms-svelte/actions/workflows/node.js.yml)

A set of components to work faster with [DatoCMS](https://www.datocms.com/) in Svelte projects.

- Works with Svelte and SvelteKit;
- Written in TypeScript;
- Usable both client and server side;

<br /><br />
<a href="https://www.datocms.com/">
<img src="https://www.datocms.com/images/full_logo.svg" height="60">
</a>
<br /><br />

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Development](#development)

## Features

`@datocms/svelte` contains ready-to-use Svelte components and usage examples.

Components:

- [`<Image />`](src/lib/components/Image)
- [`<StructuredText />`](src/lib/components/StructuredText)
- [`<Head />`](src/lib/components/Head)

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
