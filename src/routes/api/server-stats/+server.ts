import { json } from '@sveltejs/kit';
import { emby } from '$lib/server/emby';
import { tmdb } from '$lib/server/tmdb';
import type { RequestHandler } from './$types';
import type { TopItem } from '$lib/server/stats';

export interface ServerStats {
    totalUsers: number;
    totalMinutes: number;
    totalMovies: number;
    totalEpisodes: number;
    peakMonth: number;
    monthlyMinutes: number[];
    topShows: TopItem[];
    topMovies: TopItem[];
}

// Cache for server stats (expires after 5 minutes)
let cachedStats: ServerStats | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const GET: RequestHandler = async () => {
    try {
        // Return cached data if still valid
        if (cachedStats && Date.now() - cacheTime < CACHE_TTL) {
            console.log('Returning cached server stats');
            return json(cachedStats);
        }

        console.log('Generating fresh server stats...');
        const startTime = Date.now();

        const users = await emby.getUsers();

        // Aggregate stats from all users in parallel (batch of 10)
        let totalMinutes = 0;
        let totalMovies = 0;
        let totalEpisodes = 0;
        const monthlyMinutes = new Array(12).fill(0);
        const showMap = new Map<string, { name: string; minutes: number; count: number }>();
        const movieMap = new Map<string, { name: string; minutes: number; count: number }>();

        // Process users in parallel batches of 10
        const BATCH_SIZE = 10;
        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE);

            const batchResults = await Promise.allSettled(
                batch.map(async (user) => {
                    try {
                        const activity = await emby.getUserPlaybackActivity(user.Id, 365);
                        return { user, activity };
                    } catch {
                        return null;
                    }
                })
            );

            for (const result of batchResults) {
                if (result.status === 'fulfilled' && result.value) {
                    const { activity } = result.value;

                    for (const item of activity) {
                        const durationSeconds = parseInt(item.duration, 10) || 0;
                        const minutes = Math.round(durationSeconds / 60);

                        // Skip music
                        const itemType = item.item_type?.toLowerCase();
                        if (itemType === 'audio' || itemType === 'musicalbum') {
                            continue;
                        }

                        totalMinutes += minutes;

                        // Parse date for monthly breakdown
                        const date = new Date(item.date);
                        const month = date.getMonth();
                        if (month >= 0 && month < 12) {
                            monthlyMinutes[month] += minutes;
                        }

                        // Count by type
                        if (itemType === 'movie') {
                            totalMovies++;
                            const name = item.item_name;
                            const existing = movieMap.get(name) || { name, minutes: 0, count: 0 };
                            existing.minutes += minutes;
                            existing.count += 1;
                            movieMap.set(name, existing);
                        } else if (itemType === 'episode') {
                            totalEpisodes++;
                            const showName = item.item_name.split(' - ')[0] || item.item_name;
                            const existing = showMap.get(showName) || { name: showName, minutes: 0, count: 0 };
                            existing.minutes += minutes;
                            existing.count += 1;
                            showMap.set(showName, existing);
                        }
                    }
                }
            }
        }

        // Find peak month
        const peakMonth = monthlyMinutes.indexOf(Math.max(...monthlyMinutes));

        // Get top 5 shows with TMDB images (in parallel)
        const topShowsRaw = [...showMap.entries()]
            .sort((a, b) => b[1].minutes - a[1].minutes)
            .slice(0, 5);

        const topShows: TopItem[] = await Promise.all(topShowsRaw.map(async ([id, data]) => {
            const tmdbUrl = await tmdb.findPosterUrl(data.name, 'tv');
            return {
                id: id.toLowerCase().replace(/\s+/g, '_'),
                name: data.name,
                imageUrl: tmdbUrl || '',
                tmdbImageUrl: tmdbUrl || undefined,
                minutes: Math.round(data.minutes),
                count: data.count
            };
        }));

        // Get top 5 movies with TMDB images (in parallel)
        const topMoviesRaw = [...movieMap.entries()]
            .sort((a, b) => b[1].minutes - a[1].minutes)
            .slice(0, 5);

        const topMovies: TopItem[] = await Promise.all(topMoviesRaw.map(async ([id, data]) => {
            const tmdbUrl = await tmdb.findPosterUrl(data.name, 'movie');
            return {
                id: id.toLowerCase().replace(/\s+/g, '_'),
                name: data.name,
                imageUrl: tmdbUrl || '',
                tmdbImageUrl: tmdbUrl || undefined,
                minutes: Math.round(data.minutes),
                count: data.count
            };
        }));

        const stats: ServerStats = {
            totalUsers: users.length,
            totalMinutes,
            totalMovies,
            totalEpisodes,
            peakMonth,
            monthlyMinutes,
            topShows,
            topMovies
        };

        // Cache the results
        cachedStats = stats;
        cacheTime = Date.now();

        console.log(`Server stats generated in ${Date.now() - startTime}ms`);

        return json(stats);
    } catch (e) {
        console.error('Error fetching server stats:', e);
        return json({ error: 'Failed to fetch server stats' }, { status: 500 });
    }
};
