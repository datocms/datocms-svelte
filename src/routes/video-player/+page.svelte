<script>
	import { VideoPlayer } from '$lib';

	let firstVideo = {
		muxPlaybackId: 'EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs'
	};

	let data = {
		muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
		title: 'Title',
		width: 1080,
		height: 1920,
		blurUpThumb:
			'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLDhAWDhYQDg0NDhUVFg0OFxUZGBYfFiEaHysjHR0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEA4QEC8dFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABkADgMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAADBAUGAf/EABwQAAICAgMAAAAAAAAAAAAAAAEDAAIEEQUGIf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAIBITH/2gAMAwEAAhEDEQA/AByuKdRJlXTiXWJkfI7bkOprUJPYnAHcSzQXizNl9teCCXuB8EWckUjaf//Z'
	};

	let paused = true;

	let videoPlayer;
</script>

<h1>VideoPlayer</h1>

<button
	on:click={() => {
		firstVideo = { muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY' };
	}}>Change video</button
>
<VideoPlayer
	bind:this={videoPlayer}
	data={firstVideo}
	class="video-player"
	autoPlay="muted"
	on:pause={(e) => console.log('Paused!', e)}
	on:canplay={(e) => console.log('Finally can play', e)}
	on:click={(e) => console.log('Time:', e)}
/>
<hr />
<button
	on:click={() => {
		paused = !paused;
	}}>Switch paused</button
>
<VideoPlayer {data} style="aspect-ratio: 2 / 1" accentColor="#f00fff" startTime={10} {paused} />
<hr />
<VideoPlayer
	{data}
	style="aspect-ratio: 1 / 1"
	accentColor="#ffff00"
	startTime={10}
	playbackRates={[1, 10, 20]}
/>
<hr />
<VideoPlayer
	{data}
	style="aspect-ratio: undefined"
	accentColor="#ffff00"
	debug={false}
	hotkeys={['nok']}
/>
<hr />
<VideoPlayer
	{data}
	style="aspect-ratio: 10 / 1; --controls: none; --media-object-fit: cover"
	autoPlay="muted"
	loop
/>
<hr />
<VideoPlayer {data} style={undefined} autoPlay="muted" />
<hr />
<VideoPlayer data={{ playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY' }} />
