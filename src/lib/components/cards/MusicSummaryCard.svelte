<script lang="ts">
	import { onMount } from "svelte";
	import type { MusicStats } from "$lib/server/stats";
	import ShareButton from "../ui/ShareButton.svelte";

	export let music: MusicStats;

	let visible = false;

	onMount(() => {
		setTimeout(() => (visible = true), 100);
	});

	$: hours = Math.round(music.totalMinutes / 60);
	$: topArtist = music.topArtists[0];
	$: otherArtists = music.topArtists.slice(1, 5);
</script>

<div class="card-base" class:visible id="music-summary-card">
	<div class="share-container">
		<ShareButton targetId="music-summary-card" fileName="music-summary.png" />
	</div>

	<div class="content">
		<div class="header">
			<span class="label">Your Music</span>
		</div>

		<div class="time-display">
			<div class="big-number font-display">{hours.toLocaleString()}</div>
			<div class="unit">hours of music</div>
		</div>

		<div class="stats-row">
			<div class="stat">
				<span class="stat-value">{music.trackCount.toLocaleString()}</span>
				<span class="stat-label">plays</span>
			</div>
		</div>

		{#if topArtist}
			<div class="top-artist-section">
				<span class="section-label">Top Artist</span>
				<div class="top-artist">
					<div class="artist-icon">
						<span>{topArtist.name.charAt(0).toUpperCase()}</span>
					</div>
					<div class="artist-info">
						<span class="artist-name">{topArtist.name}</span>
						<span class="artist-stats">{Math.round(topArtist.minutes)} min · {topArtist.count} plays</span>
					</div>
				</div>
			</div>

			{#if otherArtists.length > 0}
				<div class="other-artists">
					{#each otherArtists as artist, i}
						<div class="artist-item">
							<span class="rank">#{i + 2}</span>
							<span class="name">{artist.name}</span>
							<span class="time">{Math.round(artist.minutes)} min</span>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.card-base {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: opacity 0.8s ease;
		background: radial-gradient(
			circle at 50% 30%,
			rgba(139, 92, 246, 0.15) 0%,
			transparent 60%
		);
	}

	.card-base.visible {
		opacity: 1;
	}

	.share-container {
		position: absolute;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 50;
	}

	:global(.snapshot-mode) .share-container {
		display: none !important;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2rem;
		text-align: center;
		width: 100%;
		max-width: 400px;
	}

	.header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		font-family: "JetBrains Mono", monospace;
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.5);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.time-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.big-number {
		font-size: 5rem;
		font-weight: 800;
		line-height: 0.9;
		background: linear-gradient(180deg, #8b5cf6 0%, #ec4899 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: 0 0 80px rgba(139, 92, 246, 0.4);
	}

	.unit {
		font-size: 1.25rem;
		color: rgba(255, 255, 255, 0.7);
		font-weight: 500;
	}

	.stats-row {
		display: flex;
		gap: 2rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
	}

	.stat-label {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.top-artist-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
	}

	.section-label {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.top-artist {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 1rem;
		width: 100%;
	}

	.artist-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, #8b5cf6, #ec4899);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
		flex-shrink: 0;
	}

	.artist-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.125rem;
	}

	.artist-name {
		font-size: 1.1rem;
		font-weight: 600;
		color: white;
	}

	.artist-stats {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.other-artists {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		width: 100%;
	}

	.artist-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 0.5rem;
	}

	.rank {
		font-family: "JetBrains Mono", monospace;
		font-size: 0.7rem;
		color: #ec4899;
		width: 1.5rem;
	}

	.name {
		flex: 1;
		text-align: left;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.time {
		font-family: "JetBrains Mono", monospace;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.4);
	}
</style>
