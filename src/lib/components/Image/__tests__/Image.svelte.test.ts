import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import { completeData, minimalData, minimalDataWithRelativeUrl } from './__fixtures__/image';

import { Image } from '../../..';

const io = mockIntersectionObserver();

describe('Image', () => {
	(['intrinsic', 'fixed', 'responsive', 'fill'] as const).forEach((layout) => {
		Object.entries({ completeData, minimalData, minimalDataWithRelativeUrl }).forEach(
			([name, data]) => {
				describe(`layout=${layout}`, () => {
					describe(`data=${name}`, () => {
						describe("when the component doesn't intersect the viewport", () => {
							it('only renders the placeholder elements ', () => {
								const onLoad = vi.fn();

								const { container, component } = render(Image, { props: { data, layout } });

								component.$on('load', onLoad);

								const picture = screen.queryByTestId('picture');

								expect(picture).not.toBeInTheDocument();
								expect(onLoad).not.toHaveBeenCalled();
								expect(container).toMatchSnapshot();
							});
						});

						describe('when the component intersects the viewport', () => {
							it('shows the image ', async () => {
								const onLoad = vi.fn();

								const { container, component } = render(Image, { props: { data, layout } });

								component.$on('load', onLoad);

								await act(async () => {
									io.enterNode(await screen.findByTestId('image'));
								});

								const picture = screen.getByTestId('picture');
								const img = screen.getByTestId('img');

								fireEvent.load(img);

								expect(picture).toBeInTheDocument();
								expect(onLoad).toHaveBeenCalled();
								expect(container).toMatchSnapshot();
							});
						});
					});
				});
			}
		);
	});
});
