import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/svelte';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import Image from '../Image.svelte';

const completeData = {
	alt: 'DatoCMS swag',
	aspectRatio: 1.7777777777777777,
	base64:
		'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFQoLDhgQDg0NDh0eHREYIx8lJCIrHB0dLSs7GikyKSEuKjUlKDk1MjIyHyo4PTc+PDcxPjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7OzsvOzs7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvOzs7NTsvLy87NTU1Ly8vLzsvL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBP/EACEQAAEEAAYDAAAAAAAAAAAAAAEAAgMEBQYHESEiFWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwL/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/AFxLgDWTsAd1J5TGy7hEYqNAaNgECX7sjLMQAHJTEy1Zcarfia4lJMauAxqBhLY6ZlaOzDurWvUOd3jZPfCiEh4xs//Z',
	height: 421,
	sizes: '(max-width: 750px) 100vw, 750px',
	src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
	srcSet:
		'https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.25&fit=crop&w=750 187w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.5&fit=crop&w=750 375w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.75&fit=crop&w=750 562w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1&fit=crop&w=750 750w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1.5&fit=crop&w=750 1125w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=2&fit=crop&w=750 1500w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=3&fit=crop&w=750 2250w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=4&fit=crop&w=750 3000w',
	title: 'These are awesome, we know that.',
	width: 750
};

const minimalData = {
	base64:
		'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFQoLDhgQDg0NDh0eHREYIx8lJCIrHB0dLSs7GikyKSEuKjUlKDk1MjIyHyo4PTc+PDcxPjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7OzsvOzs7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvOzs7NTsvLy87NTU1Ly8vLzsvL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBP/EACEQAAEEAAYDAAAAAAAAAAAAAAEAAgMEBQYHESEiFWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwL/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/AFxLgDWTsAd1J5TGy7hEYqNAaNgECX7sjLMQAHJTEy1Zcarfia4lJMauAxqBhLY6ZlaOzDurWvUOd3jZPfCiEh4xs//Z',
	height: 421,
	src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
	width: 750
};

const minimalDataWithRelativeUrl = {
	base64:
		'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFQoLDhgQDg0NDh0eHREYIx8lJCIrHB0dLSs7GikyKSEuKjUlKDk1MjIyHyo4PTc+PDcxPjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7OzsvOzs7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvOzs7NTsvLy87NTU1Ly8vLzsvL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBP/EACEQAAEEAAYDAAAAAAAAAAAAAAEAAgMEBQYHESEiFWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwL/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/AFxLgDWTsAd1J5TGy7hEYqNAaNgECX7sjLMQAHJTEy1Zcarfia4lJMauAxqBhLY6ZlaOzDurWvUOd3jZPfCiEh4xs//Z',
	height: 421,
	src: '/205/image.png?ar=16%3A9&fit=crop&w=750',
	width: 750
};

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
