import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

import { VideoPlayer } from '../../..';

describe('VideoPlayer', () => {
	describe('when data object', () => {
		describe('is complete', () => {
			const data = {
				muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
				title: 'Title',
				width: 1080,
				height: 1920,
				blurUpThumb: 'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A'
			};

			it('unwraps data into props ready for MUX player', () => {
				const props = { data };

				const { container } = render(VideoPlayer, { props });

				expect(container).toMatchSnapshot();
			});

			describe('and `class` is passed', () => {
				it('uses it for the <mux-player /> element', () => {
					const props = { data, class: 'main-player' };

					const { container } = render(VideoPlayer, { props });

					expect(container).toMatchSnapshot();
				});
			});

			describe('and an explicitly `undefined` style is passed', () => {
				it('avoids adding aspect ratio', () => {
					const props = { data, style: undefined };

					const { container } = render(VideoPlayer, { props });

					expect(container).toMatchSnapshot();
				});
			});

			describe('and a style string is passed', () => {
				describe("that doesn't include aspect ratio", () => {
					it('adds computed aspect ratio', () => {
						const props = { data, style: 'margin: auto;' };

						const { container } = render(VideoPlayer, { props });

						expect(container).toMatchSnapshot();
					});
				});

				describe('that defines the aspect ratio property', () => {
					describe('as a valid CSS value', () => {
						it('uses the passed value to override default aspect ratio', () => {
							const props = { data, style: 'aspect-ratio: auto' };

							const { container } = render(VideoPlayer, { props });

							expect(container).toMatchSnapshot();
						});
					});
				});
			});
		});

		describe('contains `muxPlaybackId`', () => {
			const data = {
				muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY'
			};

			it('uses it for `playbackId`', () => {
				const props = { data };

				const { container } = render(VideoPlayer, { props });

				expect(container).toMatchSnapshot();
			});
		});

		describe('contains `playbackId`', () => {
			const data = {
				playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY'
			};

			it('uses it for `playbackId`', () => {
				const props = { data };

				const { container } = render(VideoPlayer, { props });

				expect(container).toMatchSnapshot();
			});
		});

		describe('lacks of `width` and `height` values', () => {
			const data = {
				muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
				title: 'Title'
			};

			it('avoids adding aspect ratio', () => {
				const props = { data };

				const { container } = render(VideoPlayer, { props });

				expect(container).toMatchSnapshot();
			});
		});

		describe('lacks of `title` value', () => {
			const data = {
				muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
				width: 1080,
				height: 1920
			};

			it('avoids adding a title', () => {
				const props = { data };

				const { container } = render(VideoPlayer, { props });

				expect(container).toMatchSnapshot();
			});
		});
	});
});
