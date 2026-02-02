import { error } from '@sveltejs/kit';
import { emby } from '$lib/server/emby';
import { tmdb } from '$lib/server/tmdb';
import { aggregateUserStats, parseTimeRange, timeRangeToString, getAvailableTimeRanges, type UserStats, type TopItem, type TimeRange } from '$lib/server/stats';
import type { PageServerLoad } from './$types';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Use /tmp for cache in production (Docker read-only filesystem)
const STATS_CACHE_DIR = process.env.NODE_ENV === 'production' ? '/tmp/stats-cache' : '.cache/stats';
const STATS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Ensure cache directory exists
try {
    if (!existsSync(STATS_CACHE_DIR)) {
        mkdirSync(STATS_CACHE_DIR, { recursive: true });
    }
} catch (e) {
    console.warn('Could not create stats cache directory:', e);
}

interface CachedStats {
    stats: UserStats;
    timestamp: number;
}

function getCachedStats(userId: string, timeRange: string): UserStats | null {
    const cachePath = join(STATS_CACHE_DIR, `${userId}_${timeRange}.json`);
    if (!existsSync(cachePath)) return null;

    try {
        const cached: CachedStats = JSON.parse(readFileSync(cachePath, 'utf-8'));
        const age = Date.now() - cached.timestamp;

        if (age < STATS_CACHE_TTL_MS) {
            return cached.stats;
        }
    } catch {
        // Cache read failed
    }
    return null;
}

function setCachedStats(userId: string, timeRange: string, stats: UserStats): void {
    const cachePath = join(STATS_CACHE_DIR, `${userId}_${timeRange}.json`);
    try {
        const cached: CachedStats = { stats, timestamp: Date.now() };
        writeFileSync(cachePath, JSON.stringify(cached));
    } catch {
        // Cache write failed, continue without caching
    }
}

        // Get available time range options
        const timeRangeOptions = getAvailableTimeRanges();

        return {
            stats,
            userImageUrl,
            serverName: 'Emby for the People',
            currentTimeRange: timeRangeStr,
            timeRangeOptions
        };
    } catch (e) {
        if ((e as { status?: number }).status === 404) {
            throw e;
        }

        throw error(500, 'Failed to load your wrapped data');
    }
};
