<script lang="ts" context="module">
	import {
		isBlock,
		isBlockquote,
		isCode,
		isHeading,
		isInlineItem,
		isItemLink,
		isLink,
		isList,
		isListItem,
		isParagraph,
		isRoot,
		isSpan,
		isThematicBreak,
		RenderError
	} from 'datocms-structured-text-utils';

	import type * as STU from 'datocms-structured-text-utils';

	import Paragraph from './nodes/Paragraph.svelte';
	import Root from './nodes/Root.svelte';
	import Span from './nodes/Span.svelte';
	import Link from './nodes/Link.svelte';
	import List from './nodes/List.svelte';
	import Heading from './nodes/Heading.svelte';
	import Blockquote from './nodes/Blockquote.svelte';
	import ListItem from './nodes/ListItem.svelte';
	import ThematicBreak from './nodes/ThematicBreak.svelte';
	import Code from './nodes/Code.svelte';

	// FIXME: remove duplication with StructuredText.svelte
	type PredicateComponentTuple = [
		(node: Node) => boolean,
		new (...any: any[]) => SvelteComponentTyped
	];

	export const DEFAULT_COMPONENTS: PredicateComponentTuple[] = [
		[isParagraph, Paragraph],
		[isRoot, Root],
		[isSpan, Span],
		[isLink, Link],
		[isList, List],
		[isHeading, Heading],
		[isBlockquote, Blockquote],
		[isListItem, ListItem],
		[isThematicBreak, ThematicBreak],
		[isCode, Code]
	];

	const throwRenderErrorForMissingComponent = (node: STU.Node) => {
		if (isInlineItem(node)) {
			throw new RenderError(
				`The Structured Text document contains an 'inlineItem' node, but no component for rendering is specified!`,
				node
			);
		}

		if (isItemLink(node)) {
			throw new RenderError(
				`The Structured Text document contains an 'itemLink' node, but no component for rendering is specified!`,
				node
			);
		}

		if (isBlock(node)) {
			throw new RenderError(
				`The Structured Text document contains a 'block' node, but no component for rendering is specified!`,
				node
			);
		}
	};

	const throwRenderErrorForMissingBlocks = (node: STU.Block) => {
		throw new RenderError(
			// FIXME
			`The Structured Text document contains a 'block' node, but cannot find a record with ID ${node.item} inside data.blocks!`,
			node
		);
	};

	const throwRenderErrorForMissingLinks = (node: STU.ItemLink | STU.InlineItem) => {
		throw new RenderError(
			// FIXME
			`The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ${node.item} inside data.links!`,
			node
		);
	};

	const findBlock = (node: STU.Block, blocks: STU.StructuredText['blocks']) =>
		(blocks || []).find(({ id }) => id === node.item);
	const findLink = (node: STU.ItemLink | STU.InlineItem, links: STU.StructuredText['links']) =>
		(links || []).find(({ id }) => id === node.item);
</script>

<script lang="ts">
	import type { SvelteComponentTyped } from 'svelte';

	import { hasChildren, type Node, type StructuredText } from 'datocms-structured-text-utils';

	export let node: Node;
	export let blocks: StructuredText['blocks'];
	export let links: StructuredText['links'];

	export let components: PredicateComponentTuple[] = [];

	$: predicateComponentTuple =
		[...components, ...DEFAULT_COMPONENTS].find(([predicate, component]) => predicate(node)) ||
		throwRenderErrorForMissingComponent(node);

	$: component = (predicateComponentTuple ?? [])[1];

	$: block = isBlock(node) && (findBlock(node, blocks) || throwRenderErrorForMissingBlocks(node));
	$: link =
		(isItemLink(node) && (findLink(node, links) || throwRenderErrorForMissingLinks(node))) ||
		(isInlineItem(node) && (findLink(node, links) || throwRenderErrorForMissingLinks(node)));
</script>

{#if component}
	{#if isBlock(node)}
		<svelte:component this={component} {node} {block} />
	{:else if isInlineItem(node)}
		<svelte:component this={component} {node} {link} />
	{:else if isItemLink(node)}
		<svelte:component this={component} {node} {link}>
			{#if hasChildren(node)}
				{#each node.children as child}
					<svelte:self node={child} {blocks} {links} {components} />
				{/each}
			{/if}
		</svelte:component>
	{:else}
		<svelte:component this={component} {node}>
			{#if hasChildren(node)}
				{#each node.children as child}
					<svelte:self node={child} {blocks} {links} {components} />
				{/each}
			{/if}
		</svelte:component>
	{/if}
{/if}
