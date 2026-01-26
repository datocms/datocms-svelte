<script lang="ts">
	import { createController, type Controller } from '@datocms/content-link';
	import { onDestroy, onMount } from 'svelte';

	/**
	 * ContentLink component enables click-to-edit overlays for DatoCMS content.
	 *
	 * This component provides two powerful editing experiences:
	 *
	 * 1. **Standalone website editing**: When viewing your draft content on the website,
	 *    editors can click on any content element to open the DatoCMS editor and modify
	 *    that specific field. This works by detecting stega-encoded metadata in the content
	 *    and creating interactive overlays.
	 *
	 * 2. **Web Previews plugin integration**: When your preview runs inside the Visual Editing
	 *    mode of the DatoCMS Web Previews plugin, this component automatically establishes
	 *    bidirectional communication with the plugin. This enables:
	 *    - Clicking content to instantly open the correct field in the side panel
	 *    - In-plugin navigation: users can navigate to different URLs within Visual mode
	 *      (like a browser navigation bar), and the preview updates accordingly
	 *    - Synchronized state between the preview and the DatoCMS interface
	 *
	 * @see https://www.npmjs.com/package/@datocms/content-link
	 * @see https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
	 */

	/**
	 * Callback invoked when the Web Previews plugin requests navigation to a different URL.
	 * This is used for client-side routing integration.
	 *
	 * Example with SvelteKit: onNavigateTo={(path) => goto(path)}
	 */
	export let onNavigateTo: ((path: string) => void) | undefined = undefined;

	/**
	 * Current pathname to sync with the Web Previews plugin.
	 * This keeps the plugin in sync with the current page being previewed.
	 *
	 * Example with SvelteKit: currentPath={$page.url.pathname}
	 */
	export let currentPath: string | undefined = undefined;

	/**
	 * Options to configure click-to-edit behavior.
	 */
	export interface ClickToEditOptions {
		/**
		 * Whether to automatically scroll to the nearest editable element if none
		 * is currently visible in the viewport when click-to-edit mode is enabled.
		 *
		 * @default false
		 */
		scrollToNearestTarget?: boolean;

		/**
		 * Only enable click-to-edit on devices that support hover (i.e., non-touch devices).
		 * Uses `window.matchMedia('(hover: hover)')` to detect hover capability.
		 *
		 * This is useful to avoid showing overlays on touch devices where they may
		 * interfere with normal scrolling and tapping behavior.
		 *
		 * When set to `true` on a touch-only device, click-to-edit will not be
		 * automatically enabled, but users can still toggle it manually using
		 * the Alt/Option key.
		 *
		 * @default false
		 */
		hoverOnly?: boolean;
	}

	/**
	 * Whether to enable click-to-edit overlays on mount, or options to configure them.
	 *
	 * - `true`: Enable click-to-edit mode immediately
	 * - `{ scrollToNearestTarget: true }`: Enable and scroll to nearest editable if none visible
	 * - `{ hoverOnly: true }`: Only enable on devices with hover capability (non-touch)
	 * - `false`/`undefined`: Don't enable automatically (use Alt/Option key to toggle)
	 *
	 * @example
	 * ```svelte
	 * <ContentLink enableClickToEdit={true} />
	 * <ContentLink enableClickToEdit={{ scrollToNearestTarget: true }} />
	 * <ContentLink enableClickToEdit={{ hoverOnly: true, scrollToNearestTarget: true }} />
	 * ```
	 */
	export let enableClickToEdit: boolean | ClickToEditOptions | undefined = undefined;

	/**
	 * Whether to strip stega encoding from text nodes after stamping.
	 */
	export let stripStega: boolean | undefined = undefined;

	/**
	 * Ref to limit scanning to this root instead of document.
	 * Useful for limiting the scope of content link detection to a specific container.
	 */
	export let root: ParentNode | undefined = undefined;

	let controller: Controller | null = null;
	// Store the callback to avoid recreating the controller when it changes
	let onNavigateToCallback = onNavigateTo;

	// Keep the callback up to date when prop changes
	$: onNavigateToCallback = onNavigateTo;

	onMount(() => {
		// Initialize the content-link controller
		controller = createController({
			// Handle navigation requests from the Web Previews plugin
			// Inside Visual mode, users can navigate to different URLs (like a browser bar)
			// and the plugin will request the preview to navigate accordingly
			// The callback is accessed via variable, so changes don't trigger recreation
			onNavigateTo: onNavigateToCallback
				? (path: string) => onNavigateToCallback?.(path)
				: undefined,
			// Optionally limit scanning to a specific root
			root,
			// Control stega encoding stripping behavior
			...(stripStega !== undefined ? { stripStega } : {})
		});

		// Enable click-to-edit overlays on mount if requested
		// By default, click-to-edit overlays are not enabled. Instead, editors can:
		// - Press and hold Alt/Option key to temporarily enable click-to-edit mode
		// - Release the key to disable it again
		if (enableClickToEdit) {
			controller.enableClickToEdit(enableClickToEdit === true ? undefined : enableClickToEdit);
		}
	});

	// Notify the Web Previews plugin when the URL changes
	// This keeps the plugin in sync with the current page being previewed
	$: if (currentPath !== undefined && controller) {
		controller.setCurrentPath(currentPath);
	}

	onDestroy(() => {
		if (controller) {
			controller.dispose();
			controller = null;
		}
	});
</script>
