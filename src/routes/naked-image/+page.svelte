<script lang="ts">
	import { NakedImage, type ResponsiveImageType } from '$lib';

	export const completeData: ResponsiveImageType = {
		srcSet:
			'https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.25&w=600 150w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.5&w=600 300w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.75&w=600 450w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?w=600 600w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=1.5&w=600 900w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=2&w=600 1200w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=3&w=600 1800w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=4&w=600 2400w',
		webpSrcSet:
			'https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.25&fm=webp&w=600 150w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.5&fm=webp&w=600 300w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.75&fm=webp&w=600 450w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?fm=webp&w=600 600w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=1.5&fm=webp&w=600 900w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=2&fm=webp&w=600 1200w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=3&fm=webp&w=600 1800w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=4&fm=webp&w=600 2400w',
		sizes: '(max-width: 600px) 100vw, 600px',
		src: 'https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?w=600',
		width: 600,
		height: 401,
		aspectRatio: 1.4961101137043689,
		alt: 'black marker on notebook',
		bgColor: '#d1ab0f',
		base64:
			'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBg8IExINCQ4XDhgQDQ0NFxMNDQoNFxsZGCIfFiEaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHQ8NHC8cFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABEAGAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAAAAwQFBgH/xAAeEAABBAEFAAAAAAAAAAAAAAAAAQIDBBEFFCMyM//EABYBAQEBAAAAAAAAAAAAAAAAAAECA//EABcRAQEBAQAAAAAAAAAAAAAAAAACEgH/2gAMAwEAAhEDEQA/AN01qCbbWozI3cRK0h3JkWMymOK3Si1bkZgBF6dEAc8OqX0fUXY8zgDwM5qIAAKf/9k='
	};

	export const minimalDataWithAlpha: ResponsiveImageType = {
		src: 'https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?w=600',
		width: 600,
		height: 450,
		base64:
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAC4ElEQVR42n2UXXbTQAyFpbHTtCmhFNgsO2ANbBAeOCVpEzuJ4xGfNGM75YGe3Moez9yrv1H77fsP8T8VkwRUsjSWeQZaLGuqmlvAJruamlgqyEkkNxJ2BKa+222QSsveIJ8QIrEGzBpVe2TtgW9teGI28Nyb2RG5HHt5wANJ2YWcg20VbYu3YksEBXkNnnh+SmYf+LZBaEUEfmwggh7/DxDtsxiQExZyj1+WCEJgzMXbkp57CD9C/gl8rvaJVD3y7Y6Q2JYH0YjgFcd34E8F73bAmqfJBSKCu3F0IbTtAY+3yfIz1sm/gi/gGc+3Lo5NniIi6BDYm8kWwg24B+ucQdIDeTvNNVixSq6Jytw9hSEhskoejeQN2HoUpOiBZDeS7Uqh15bN5UZwBj04Qt7mTOlrihw1gihwR3pcpHViOqnDnnkfSNFIBETuxSIHPEYH+c8QMbmQ6RMCnSXpSg201iCPNzWwHu9/JY/EcoOAR9J6ZOoiFBqBEfojxG/48wb5Hr0dOaYOXpcp/xYirfd8IZe4A0QxQPoTm7Au4mkjrfkEuRfaD3SI7OiYFw3YCx7sSmsv6YkUlYtkU9+XC1ZEfke7mpU9ahfKtOaY93XP4R3HHHt82HOo9qbVG+VXxqQtvS1THWYLDgi+Qrxh7S7WNQQ4Jic2HqHrQM9ealX6Umt7Ts+tpfoWiiWKGAVh5Yx1sg40cFxjm6+reCteODJE35d5s7ipZaHNjc03ORQWPbcD/0/o4aUwNmaBC/A00aJ69a6JW1znUK4XLbpoTFKHXeG3yRac8ejorct3WlVW4UoRoNBygLj/v0BTHtK/5E5k5inYMyHGmu9VLMc80p70vkF4DeIbgWmiVgEteRctLVarX4Q8cXZG/Fy9b2KzKAKSC7FU4kmkCEx1aH3BR63WMR1fohUmNY388Rt8kk4vpjKnYxGa0nMz7KZciSz1De7wwua5/u5vvkh6c6n0/buUtb8z6leFffMsMwAAAABJRU5ErkJggg=='
	};

	let log: string[] = [];

	const addLog = (message: string) => {
		log = [...log, message];
	};
</script>

<div style="max-width: 800px">
	<h1>NakedImage</h1>

	<NakedImage data={completeData} on:load={() => addLog('Triggered onLoad()')} />
	<pre>{log.join('\n')}</pre>

	<hr />

	<NakedImage data={completeData} imgStyle="border: 2px solid red;" />

	<hr />

	<div style="position: relative; max-width: 500px; aspect-ratio: 1 / 1;">
		<NakedImage
			data={completeData}
			imgStyle="
				z-index: -1;
				position: absolute;
				inset: 0;
				object-fit: cover;
				width: 100%;
				height: 100%;
			"
		/>
		<div
			style="
				position: absolute;
				inset: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				background: rgba(0, 0, 0, 0.4);
				font-size: 2em;
				font-weight: bold;
			"
		>
			This is a title
		</div>
	</div>

	<hr />

	<NakedImage data={minimalDataWithAlpha} />
</div>
