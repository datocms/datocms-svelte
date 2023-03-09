import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
	},

	package: {
		exports: (filepath) => {
			// See: https://github.com/sveltejs/kit/issues/3283
			if (filepath.endsWith('.DS_Store')) return false;

			// Replicate the default behaviour of `exports` configuration.
			return !/^_|\/_|\.d\.ts$/.test(filepath);
		}
	}
};

export default config;
