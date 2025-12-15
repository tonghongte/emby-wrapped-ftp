<script lang="ts">
	import { onMount } from 'svelte';
	
	export let value: number;
	export let duration: number = 2000;
	export let format: (n: number) => string = (n: number) => n.toLocaleString();
	
	let displayValue = 0;
	let mounted = false;
	
	onMount(() => {
		mounted = true;
		animateValue();
	});
	
	function animateValue() {
		const startTime = performance.now();
		const startValue = 0;
		const endValue = value;
		
		function update(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			
			// Easing: cubic-bezier(0.16, 1, 0.3, 1) approximation
			const eased = 1 - Math.pow(1 - progress, 3);
			
			displayValue = Math.round(startValue + (endValue - startValue) * eased);
			
			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}
		
		requestAnimationFrame(update);
	}
</script>

<span class="animated-number font-mono">
	{format(displayValue)}
</span>

<style>
	.animated-number {
		display: inline-block;
		font-variant-numeric: tabular-nums;
	}
</style>
