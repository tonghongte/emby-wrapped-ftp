<script lang="ts">
	export let total: number;
	export let current: number;
	export let onSelect: ((index: number) => void) | undefined = undefined;
</script>

<div class="progress-dots">
	{#each Array(total) as _, i}
		<button
			class="dot"
			class:active={i === current}
			class:past={i < current}
			on:click|stopPropagation={() => onSelect?.(i)}
			aria-label="Go to card {i + 1}"
		>
			<span class="dot-inner"></span>
		</button>
	{/each}
</div>

<style>
	.progress-dots {
		display: flex;
		gap: 6px;
		padding: 8px 12px;
		background: rgba(10, 10, 10, 0.6);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.dot {
		width: 8px;
		height: 8px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.dot-inner {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}
	
	.dot.past .dot-inner {
		background: rgba(29, 185, 84, 0.5);
	}
	
	.dot.active .dot-inner {
		background: #1db954;
		transform: scale(1.3);
		box-shadow: 0 0 8px rgba(29, 185, 84, 0.5);
	}
	
	.dot:hover .dot-inner {
		background: rgba(255, 255, 255, 0.4);
	}
	
	.dot.active:hover .dot-inner {
		background: #1db954;
	}
</style>
