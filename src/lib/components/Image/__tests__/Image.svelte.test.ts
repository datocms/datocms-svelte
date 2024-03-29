import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';
import { describe, expect, it, vi } from 'vitest';

import { completeData, minimalData, minimalDataWithRelativeUrl } from './__fixtures__/image';

import { Image } from '../../..';

const io = mockIntersectionObserver();

describe('Image', () => {
	for (const layout of ['intrinsic', 'fixed', 'responsive', 'fill'] as const) {
		for (const [name, data] of Object.entries({
			completeData,
			minimalData,
			minimalDataWithRelativeUrl
		})) {
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
	}

	it('takes styles', () => {
		const onLoad = vi.fn();

		const { container, component } = render(Image, {
			props: { data: completeData, style: 'background: red; overflow: visible; padding: 0px 10px;' }
		});

		component.$on('load', onLoad);

		const picture = screen.queryByTestId('picture');

		expect(picture).not.toBeInTheDocument();
		expect(onLoad).not.toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});
});
