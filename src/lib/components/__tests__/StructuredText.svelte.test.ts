import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

import {
	RenderError,
	isBlock,
	isHeading,
	isInlineItem,
	isItemLink,
	isSpan
} from 'datocms-structured-text-utils';

import StructuredText, { type StructuredText as ST } from '../StructuredText.svelte';

import CustomSpan from './__fixtures__/CustomSpan.svelte';
import IncreasedLevelHeading from './__fixtures__/IncreasedLevelHeading.svelte';
import ItemLink from './__fixtures__/ItemLink.svelte';
import Block from './__fixtures__/Block.svelte';
import InlineItem from './__fixtures__/InlineItem.svelte';
import type { DocPageRecord, QuoteRecord } from './__fixtures__/types';

describe('StructuredText', () => {
	describe('with no value', () => {
		it('renders null', () => {
			const { container } = render(StructuredText, { props: { data: null } });

			expect(container).toMatchSnapshot();
		});
	});

	describe('simple dast /2', () => {
		const structuredText: ST = {
			value: {
				schema: 'dast',
				document: {
					type: 'root',
					children: [
						{
							type: 'heading',
							level: 1,
							children: [
								{
									type: 'span',
									value: 'This\nis a '
								},
								{
									type: 'span',
									marks: ['strong'],
									value: 'title'
								}
							]
						}
					]
				}
			}
		};

		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, { props: { data: structuredText } });

				expect(container).toMatchSnapshot();
			});
		});

		describe('with custom mark rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: { data: structuredText, components: [[isSpan, CustomSpan]] }
				});

				expect(container).toMatchSnapshot();
			});
		});
	});

	describe('simple dast with no links/blocks', () => {
		const structuredText: ST = {
			value: {
				schema: 'dast',
				document: {
					type: 'root',
					children: [
						{
							type: 'heading',
							level: 1,
							children: [
								{
									type: 'span',
									value: 'This\nis a '
								},
								{
									type: 'span',
									marks: ['strong'],
									value: 'title'
								}
							]
						}
					]
				}
			}
		};

		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: { data: structuredText }
				});

				expect(container).toMatchSnapshot();
			});
		});

		describe('with custom rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: { data: structuredText, components: [[isHeading, IncreasedLevelHeading]] }
				});

				expect(container).toMatchSnapshot();
			});
		});
	});

	describe('with links/blocks', () => {
		const structuredText: ST<QuoteRecord, DocPageRecord> = {
			value: {
				schema: 'dast',
				document: {
					type: 'root',
					children: [
						{
							type: 'heading',
							level: 1,
							children: [
								{
									type: 'span',
									value: 'This is a'
								},
								{
									type: 'span',
									marks: ['highlight'],
									value: 'title'
								},
								{
									type: 'inlineItem',
									item: '123'
								},
								{
									type: 'itemLink',
									item: '123',
									meta: [{ id: 'target', value: '_blank' }],
									children: [{ type: 'span', value: 'here!' }]
								}
							]
						},
						{
							type: 'block',
							item: '456'
						}
					]
				}
			},
			blocks: [
				{
					id: '456',
					__typename: 'QuoteRecord',
					quote: 'Foo bar.',
					author: 'Mark Smith'
				}
			],
			links: [
				{
					id: '123',
					__typename: 'DocPageRecord',
					title: 'How to code',
					slug: 'how-to-code'
				}
			]
		};

		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: {
						data: structuredText,
						components: [
							[isInlineItem, InlineItem],
							[isItemLink, ItemLink],
							[isBlock, Block]
						]
					}
				});

				expect(container).toMatchSnapshot();
			});
		});

		describe('with missing component for inline records', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: { data: structuredText }
					});
				}).toThrow(RenderError);
			});
		});

		describe('with missing record', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: {
							data: { ...structuredText, links: [] },
							components: [[isInlineItem, InlineItem]]
						}
					});
				}).toThrow(RenderError);
			});
		});
	});
});
