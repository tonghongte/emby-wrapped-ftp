<script lang="ts">
	import CardStack from "$lib/components/CardStack.svelte";
	import AudioPlayer from "$lib/components/ui/AudioPlayer.svelte";
	import IntroCard from "$lib/components/cards/IntroCard.svelte";
	import TotalTimeCard from "$lib/components/cards/TotalTimeCard.svelte";
	import TopContentCard from "$lib/components/cards/TopContentCard.svelte";
	import GenreCard from "$lib/components/cards/GenreCard.svelte";
	import Top5Card from "$lib/components/cards/Top5Card.svelte";
	import WatchingClockCard from "$lib/components/cards/WatchingClockCard.svelte";
	import DayOfWeekCard from "$lib/components/cards/DayOfWeekCard.svelte";
	import MonthlyJourneyCard from "$lib/components/cards/MonthlyJourneyCard.svelte";
	import BingeCard from "$lib/components/cards/BingeCard.svelte";
	import FirstLastWatchCard from "$lib/components/cards/FirstLastWatchCard.svelte";
	import FinaleCard from "$lib/components/cards/FinaleCard.svelte";
	import PersonalityCard from "$lib/components/cards/PersonalityCard.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	$: ({ stats, userImageUrl, serverName } = data);

	// Build card sequence based on available data
	interface Card {
		type: string;
		component: any;
		props: Record<string, any>;
	}

	let cards: Card[] = [];

	$: {
		cards = [];

		// 1. Always show intro
		cards.push({
			type: "intro",
			component: IntroCard,
			props: { stats, serverName, userImageUrl },
		});

		// 2. Total time
		cards.push({
			type: "total_time",
			component: TotalTimeCard,
			props: { stats },
		});

		// 3. Top show (if exists)
		if (stats.topShows.length > 0) {
			cards.push({
				type: "top_show",
				component: TopContentCard,
				props: { topItem: stats.topShows[0], type: "show", rank: 1 },
			});
		}

		// 4. Top movie (if exists)
		if (stats.topMovies.length > 0) {
			cards.push({
				type: "top_movie",
				component: TopContentCard,
				props: { topItem: stats.topMovies[0], type: "movie", rank: 1 },
			});
		}

		// 5. Genre breakdown (if we have genres)
		if (stats.topGenres.length > 0) {
			cards.push({
				type: "genres",
				component: GenreCard,
				props: { genres: stats.topGenres },
			});
		}

		// 6. Top 5 shows (if we have enough) - pass actual count
		if (stats.topShows.length >= 3) {
			cards.push({
				type: "top5_shows",
				component: Top5Card,
				props: {
					items: stats.topShows,
					title: "Your Top Shows",
					type: "shows",
					totalCount: stats.uniqueShows, // Actual unique show count
				},
			});
		}

		// 7. Top 5 movies (if we have enough) - pass actual count
		if (stats.topMovies.length >= 3) {
			cards.push({
				type: "top5_movies",
				component: Top5Card,
				props: {
					items: stats.topMovies,
					title: "Your Top Movies",
					type: "movies",
					totalCount: stats.uniqueMovies, // Actual unique movie count
				},
			});
		}

		// 8. Watching clock (hourly patterns)
		if (stats.totalMinutes > 0) {
			cards.push({
				type: "clock",
				component: WatchingClockCard,
				props: { stats },
			});
		}

		// 9. Viewing Personality - NEW!
		cards.push({
			type: "personality",
			component: PersonalityCard,
			props: { stats },
		});

		// 10. Day of week patterns
		if (stats.heatmap.days.some((d) => d > 0)) {
			cards.push({
				type: "day_of_week",
				component: DayOfWeekCard,
				props: { stats },
			});
		}

		// 11. Monthly journey
		if (stats.heatmap.months.some((m) => m > 0)) {
			cards.push({
				type: "monthly",
				component: MonthlyJourneyCard,
				props: { stats },
			});
		}

		// 11. Binge card (if we have a binge session) - moved before journey
		if (stats.longestBinge) {
			cards.push({
				type: "binge",
				component: BingeCard,
				props: {
					binge: stats.longestBinge,
					totalBinges: stats.bingeCount,
				},
			});
		}

		// 12. First & Last watch (journey card) - NOW NEAR THE END
		if (stats.firstWatch && stats.lastWatch) {
			cards.push({
				type: "first_last",
				component: FirstLastWatchCard,
				props: { stats },
			});
		}

		// 13. Always end with finale
		cards.push({
			type: "finale",
			component: FinaleCard,
			props: { stats },
		});
	}
</script>

<svelte:head>
	<title>{stats.username}'s 2025 Wrapped ◈ Emby for the People</title>
	<meta
		name="description"
		content="{stats.username} watched {Math.round(
			stats.totalMinutes / 60,
		)} hours on Emby for the People in 2025."
	/>
</svelte:head>

<CardStack totalCards={cards.length} let:cardIndex let:isActive>
	{#if isActive}
		<svelte:component
			this={cards[cardIndex].component}
			{...cards[cardIndex].props}
		/>
	{/if}
</CardStack>

<style>
	:global(body) {
		overflow: hidden;
	}
</style>
