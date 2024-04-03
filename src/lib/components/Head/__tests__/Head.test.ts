import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

import { Head } from '../../..';

import { metaTags } from './__fixtures__/head';

describe('Head', () => {
	it('renders meta tags', () => {
		const { container } = render(Head, { props: { data: metaTags } });

		expect(container.ownerDocument.head).toMatchSnapshot();
	});
});
