<script lang="ts">
	import type * as CSS from 'csstype';

	export let base64: string | null = null;
	export let backgroundColor: string | null = null;
	export let objectFit: CSS.Properties['objectFit'];
	export let objectPosition: CSS.Properties['objectPosition'];
	export let showImage: boolean;
	export let fadeInDuration = 0;

	let transition = fadeInDuration > 0 ? `opacity ${fadeInDuration}ms` : undefined;
	let opacity = showImage ? 0 : 1;
</script>

<img
	class="placeholder"
	aria-hidden="true"
	alt=""
	src={base64}
	style:background-color={backgroundColor}
	style:object-fit={objectFit}
	style:object-position={objectPosition}
	style:transition
	style:opacity
/>

<style>
	.placeholder {
		position: absolute;
		width: 100%;
		top: 0;
		scale: 110%;
	}
</style>
