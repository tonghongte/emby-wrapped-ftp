<script lang="ts">
	import "../app.css";
	import AudioPlayer from "$lib/components/ui/AudioPlayer.svelte";

	export let data;
</script>

<svelte:head>
	<title>Emby Wrapped 2025 ◈ Emby for the People</title>
	<meta
		name="description"
		content="Your 2025 viewing year, rewatched. Discover your personal media statistics from Emby for the People."
	/>
	<meta property="og:title" content="Emby Wrapped 2025" />
	<meta
		property="og:description"
		content="Your 2025 viewing year, rewatched."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	{#if data.analyticsScript}
		{@html data.analyticsScript}
	{/if}
</svelte:head>

<div class="app">
	<AudioPlayer />
	<slot />
</div>

<style>
	.app {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
</style>
