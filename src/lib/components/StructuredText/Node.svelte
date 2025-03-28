<script lang="ts" context="module">
	import {
		isBlock,
		isInlineBlock,
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
		throw new RenderError(
			`The Structured Text document contains an '${node.type}' node, but no component for rendering is specified!`,
			node
		);
	};

	const throwRenderErrorForMissingBlock = (node: STU.Block) => {
		throw new RenderError(
			`The Structured Text document contains a '${node.type}' node, but cannot find a record with ID ${node.item} inside data.blocks!`,
			node
		);
	};

	const throwRenderErrorForMissingInlineBlock = (node: STU.InlineBlock) => {
		throw new RenderError(
			`The Structured Text document contains a '${node.type}' node, but cannot find a record with ID ${node.item} inside data.inlineBlocks!`,
			node
		);
	};

	const throwRenderErrorForMissingLink = (node: STU.ItemLink | STU.InlineItem) => {
		throw new RenderError(
			`The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ${node.item} inside data.links!`,
			node
		);
	};

	const findBlock = (node: STU.Block, blocks: STU.StructuredText['blocks']) =>
		(blocks || []).find(({ id }) => id === node.item);

	const findInlineBlock = (
		node: STU.InlineBlock,
		inlineBlocks: STU.StructuredText['inlineBlocks']
	) => (inlineBlocks || []).find(({ id }) => id === node.item);

	const findLink = (node: STU.ItemLink | STU.InlineItem, links: STU.StructuredText['links']) =>
		(links || []).find(({ id }) => id === node.item);
</script>

<script lang="ts">
	import { hasChildren, type Node, type StructuredText } from 'datocms-structured-text-utils';

	import type { PredicateComponentTuple } from '$lib';

	export let node: Node;
	export let blocks: StructuredText['blocks'];
	export let inlineBlocks: StructuredText['inlineBlocks'];
	export let links: StructuredText['links'];

	export let components: PredicateComponentTuple[] = [];

	$: predicateComponentTuple =
		[...components, ...DEFAULT_COMPONENTS].find(([predicate, component]) => predicate(node)) ||
		throwRenderErrorForMissingComponent(node);

	$: block = isBlock(node) && (findBlock(node, blocks) || throwRenderErrorForMissingBlock(node));

	$: inlineBlock =
		isInlineBlock(node) &&
		(findInlineBlock(node, inlineBlocks) || throwRenderErrorForMissingInlineBlock(node));

	$: link =
		(isItemLink(node) && (findLink(node, links) || throwRenderErrorForMissingLink(node))) ||
		(isInlineItem(node) && (findLink(node, links) || throwRenderErrorForMissingLink(node)));

	$: component = (predicateComponentTuple ?? [])[1];
</script>

{#if component}
	{#if isBlock(node)}
		<svelte:component this={component} {node} {block} />
	{:else if isInlineBlock(node)}
		<svelte:component this={component} {node} block={inlineBlock} />
	{:else if isInlineItem(node)}
		<svelte:component this={component} {node} {link} />
	{:else if isItemLink(node)}
		<svelte:component this={component} {node} {link}>
			{#if hasChildren(node)}
				{#each node.children as child}
					<svelte:self node={child} {blocks} {inlineBlocks} {links} {components} />
				{/each}
			{/if}
		</svelte:component>
	{:else}
		<svelte:component this={component} {node}>
			{#if hasChildren(node)}
				{#each node.children as child}
					<svelte:self node={child} {blocks} {inlineBlocks} {links} {components} />
				{/each}
			{/if}
		</svelte:component>
	{/if}
{/if}
