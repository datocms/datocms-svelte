import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

import {
	isBlock,
	isInlineBlock,
	isHeading,
	isInlineItem,
	isItemLink,
	isSpan
} from 'datocms-structured-text-utils';

import { StructuredText } from '../../..';

import {
	heading,
	paragraphWithLink,
	structuredTextWithBlocksAndLinks,
	full
} from './__fixtures__/structuredText';

import CustomSpan from './__fixtures__/CustomSpan.svelte';
import IncreasedLevelHeading from './__fixtures__/IncreasedLevelHeading.svelte';
import ItemLink from './__fixtures__/ItemLink.svelte';
import Block from './__fixtures__/Block.svelte';
import InlineItem from './__fixtures__/InlineItem.svelte';
import InlineBlock from './__fixtures__/InlineBlock.svelte';

describe('StructuredText', () => {
	describe('with no value', () => {
		it('renders null', () => {
			const { container } = render(StructuredText, { props: { data: null } });

			expect(container).toMatchSnapshot();
		});
	});

	describe('with a very simple pure dast (only the `value` of a structured text)', () => {
		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, { props: { data: heading.value } });

				expect(container).toMatchSnapshot();
			});
		});

		describe('with custom mark rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: { data: heading, components: [[isSpan, CustomSpan]] }
				});

				expect(container).toMatchSnapshot();
			});
		});
	});

	describe('with a very simple dast', () => {
		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, { props: { data: heading } });

				expect(container).toMatchSnapshot();
			});
		});

		describe('with custom mark rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: { data: heading, components: [[isSpan, CustomSpan]] }
				});

				expect(container).toMatchSnapshot();
			});
		});
	});

	describe('with a dast which has a link inside', () => {
		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, { props: { data: paragraphWithLink } });

				expect(container).toMatchSnapshot();
			});
		});
	});

	describe('with a dast with no links nor blocks', () => {
		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: { data: heading }
				});

				expect(container).toMatchSnapshot();
			});
		});

		describe('with custom rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: { data: heading, components: [[isHeading, IncreasedLevelHeading]] }
				});

				expect(container).toMatchSnapshot();
			});
		});
	});

	describe('with a dast including links and blocks', () => {
		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: {
						data: structuredTextWithBlocksAndLinks,
						components: [
							[isInlineItem, InlineItem],
							[isItemLink, ItemLink],
							[isBlock, Block],
							[isInlineBlock, InlineBlock],
						]
					}
				});

				expect(container).toMatchSnapshot();
			});
		});

		describe('with missing component for item links', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: {
							data: structuredTextWithBlocksAndLinks,
							components: [
								[isBlock, Block],
								[isInlineBlock, InlineBlock],
								[isInlineItem, InlineItem]
							]
						}
					});
				}).toThrowErrorMatchingSnapshot();
			});
		});

		describe('with missing component for inline items', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: {
							data: structuredTextWithBlocksAndLinks,
							components: [
								[isBlock, Block],
								[isInlineBlock, InlineBlock],
								[isItemLink, ItemLink]
							]
						}
					});
				}).toThrowErrorMatchingSnapshot();
			});
		});

		describe('with missing links', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: {
							data: { ...structuredTextWithBlocksAndLinks, links: [] },
							components: [
								[isBlock, Block],
								[isInlineBlock, InlineBlock],
								[isInlineItem, InlineItem],
								[isItemLink, ItemLink]
							]
						}
					});
				}).toThrowErrorMatchingSnapshot();
			});
		});

		describe('with missing component for blocks', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: {
							data: structuredTextWithBlocksAndLinks,
							components: [
								[isInlineItem, InlineItem],
								[isItemLink, ItemLink]
							]
						}
					});
				}).toThrowErrorMatchingSnapshot();
			});
		});

		describe('with missing component for inline blocks', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: {
							data: structuredTextWithBlocksAndLinks,
							components: [
								[isBlock, Block],
								[isInlineItem, InlineItem],
								[isItemLink, ItemLink]
							]
						}
					});
				}).toThrowErrorMatchingSnapshot();
			});
		});

		describe('with missing blocks', () => {
			it('raises an error', () => {
				expect(() => {
					render(StructuredText, {
						props: {
							data: { ...structuredTextWithBlocksAndLinks, blocks: [] },
							components: [
								[isBlock, Block],
								[isInlineBlock, InlineBlock],
								[isInlineItem, InlineItem],
								[isItemLink, ItemLink]
							]
						}
					});
				}).toThrowErrorMatchingSnapshot();
			});
		});
	});

	describe('with a dast including a sprinkle of everything', () => {
		describe('with default rules', () => {
			it('renders the document', () => {
				const { container } = render(StructuredText, {
					props: {
						data: full,
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
	});
});
