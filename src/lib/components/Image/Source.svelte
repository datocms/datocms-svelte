<script lang="ts">
	export let srcset: string | null;
	export let sizes: string | null;
	export let type: string | null = null;
</script>

<source {srcset} {sizes} {type} />
