# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-02-04

### Added
- **Music Artist/Track Images**: Added support for displaying images for top artists and tracks in the music summary card.
- **Image Proxy Server**: Implemented `/api/proxy-image` to handle image fetching, solve CORS issues, and provide server-side caching.
- **Library Filtering**: Introduced `FILTER_USER_ID` environment variable to allow filtering content based on a specific Emby user's permissions (useful for hiding NSFW content).
- **Monthly Wrapped**: Added support for viewing statistics for individual months in addition to the full year.
- **Image Error Handling**: Improved robustness with reactive image error tracking and fallback placeholders.

### Changed
- **Higher Resolution Images**: Updated image fetching logic to request 400px images instead of 200px for better visual quality.
- **UI Enhancements**: Redesigned `MusicSummaryCard` to show top artists and songs side-by-side with larger thumbnails.
- **Improved Emby Integration**: Enhanced `EmbyClient` with methods to retrieve API base URL and key for more flexible image URL generation.
- **Caching**: Improved image caching mechanism with disk-based persistence in `/tmp` for production environments.

### Fixed
- **Image Loading Issues**: Fixed CORS and connection issues by proxying all media images through the server.
- **Layout Consistency**: Adjusted spacing and dimensions in summary cards for a more cohesive look.

---

## [1.0.0] - 2025-12-31

### Initial Release
- Basic Emby Wrapped functionality.
- Yearly statistics for movies and shows.
- Basic music statistics.
- Shareable image cards.
