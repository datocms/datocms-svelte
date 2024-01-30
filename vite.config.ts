import { sveltekit } from '@sveltejs/kit/vite';

export default {
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true,
		// Carefully see this thread to understand the next lines and
		// how they can impact the Svelte IntersectionObserver.
		alias: [{ find: /^svelte$/, replacement: 'svelte/internal' }]
	}
};
