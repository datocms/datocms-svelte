<script lang="ts">
	import { encode } from 'universal-base64';

	let klass: string | null = null;

	export { klass as class };
	export let width: number;
	export let height: number | null | undefined;
	export let aspectRatio: number | undefined;

	let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${
		height ?? (aspectRatio ? width / aspectRatio : 0)
	}"></svg>`;
</script>

<img
	class={klass}
	style:display="block"
	style:width="100%"
	src="data:image/svg+xml;base64,{encode(svg)}"
	aria-hidden="true"
	alt=""
/>
