<script>
	import { Head } from '$lib';
	import { metaTags } from '$lib/components/Head/__tests__/__fixtures__/head';
</script>

<h1>Head</h1>

<p>Inspect &lt;head /&gt; tag for this page to see the meta tags injected by the &lt;Head /&gt; component (tag content is purely by way of examples).</p>

<Head data={metaTags} />
