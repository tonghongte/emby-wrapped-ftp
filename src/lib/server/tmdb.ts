import { env } from '$env/dynamic/private';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

interface TMDBSearchResult {
    id: number;
    name?: string;
    title?: string;
    poster_path: string | null;
    backdrop_path: string | null;
}

interface TMDBSearchResponse {
    results: TMDBSearchResult[];
}

class TMDBClient {
    private get apiKey(): string {
        return env.TMDB_API_KEY || '';
    }

    private get isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Search for a TV show by name
     */
    async searchTV(query: string): Promise<TMDBSearchResult | null> {
        if (!this.isConfigured) {
            console.warn('TMDB: API key not configured');
            return null;
        }

        try {
            const url = new URL(`${TMDB_BASE_URL}/search/tv`);
            url.searchParams.set('api_key', this.apiKey);
            url.searchParams.set('query', query);
            url.searchParams.set('page', '1');

            const response = await fetch(url.toString());
            if (!response.ok) {
                console.warn(`TMDB search failed for "${query}": ${response.status}`);
                return null;
            }

            const data: TMDBSearchResponse = await response.json();
            if (data.results[0]) {
                console.log(`TMDB found: "${query}" -> poster: ${data.results[0].poster_path}`);
            }
            return data.results[0] || null;
        } catch (e) {
            console.warn('TMDB TV search failed:', e);
            return null;
        }
    }

    /**
     * Search for a movie by name
     */
    async searchMovie(query: string): Promise<TMDBSearchResult | null> {
        if (!this.isConfigured) return null;

        try {
            const url = new URL(`${TMDB_BASE_URL}/search/movie`);
            url.searchParams.set('api_key', this.apiKey);
            url.searchParams.set('query', query);
            url.searchParams.set('page', '1');

            const response = await fetch(url.toString());
            if (!response.ok) return null;

            const data: TMDBSearchResponse = await response.json();
            return data.results[0] || null;
        } catch (e) {
            console.warn('TMDB movie search failed:', e);
            return null;
        }
    }

    /**
     * Get poster URL for a TMDB result
     */
    getPosterUrl(result: TMDBSearchResult, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w342'): string | null {
        if (!result.poster_path) return null;
        return `${TMDB_IMAGE_BASE}/${size}${result.poster_path}`;
    }

    /**
     * Get backdrop URL for a TMDB result
     */
    getBackdropUrl(result: TMDBSearchResult, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w780'): string | null {
        if (!result.backdrop_path) return null;
        return `${TMDB_IMAGE_BASE}/${size}${result.backdrop_path}`;
    }

    /**
     * Search for content and get poster URL directly
     */
    async findPosterUrl(name: string, type: 'tv' | 'movie'): Promise<string | null> {
        const result = type === 'tv'
            ? await this.searchTV(name)
            : await this.searchMovie(name);

        if (!result) return null;
        return this.getPosterUrl(result);
    }
}

// Export singleton
export const tmdb = new TMDBClient();

// Cache for TMDB lookups to avoid repeated API calls
const imageCache = new Map<string, string | null>();

/**
 * Get the best available image URL with TMDB fallback
 */
export async function getBestImageUrl(
    embyImageUrl: string,
    name: string,
    type: 'show' | 'movie'
): Promise<string> {
    // Try Emby image first by making a HEAD request
    try {
        const response = await fetch(embyImageUrl, { method: 'HEAD' });
        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            return embyImageUrl;
        }
    } catch {
        // Emby image failed, try TMDB
    }

    // Check cache
    const cacheKey = `${type}:${name}`;
    if (imageCache.has(cacheKey)) {
        const cached = imageCache.get(cacheKey);
        return cached || embyImageUrl;
    }

    // Try TMDB fallback
    const tmdbUrl = await tmdb.findPosterUrl(name, type === 'show' ? 'tv' : 'movie');
    imageCache.set(cacheKey, tmdbUrl);

    return tmdbUrl || embyImageUrl;
}
