# Continue Watching Component

Netflix-style "Continue Watching" component with auto-refresh and progress tracking.

## Features

- ✅ Fetches watch sessions from Laravel API
- ✅ Shows progress bars on thumbnails
- ✅ Auto-refreshes every 30 seconds
- ✅ Loading and error states
- ✅ Responsive grid layout (2-6 columns)
- ✅ Click to resume at saved timestamp
- ✅ TypeScript types
- ✅ React Query for data fetching
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Optimistic image loading with fallbacks

## Usage

### Basic Usage

```tsx
import { ContinueWatching } from '@/components/ContinueWatching';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ContinueWatching />
    </div>
  );
}
```

### With Custom Limit

```tsx
<ContinueWatching limit={8} />
```

### With Custom Styling

```tsx
<ContinueWatching
  limit={12}
  className="my-custom-class"
/>
```

## API Requirements

The component expects a Laravel API endpoint at:

```
GET /api/v1/patron/continue-watching?limit={limit}
```

### Expected Response Format

```json
{
  "sessions": [
    {
      "content_id": "uuid",
      "title": "Video Title",
      "thumbnail_url": "https://...",
      "progress": 150,
      "total": 300,
      "percentage": 50,
      "last_watched": "2025-10-03T14:30:00Z",
      "series_name": "Series Name",
      "season_number": 1,
      "episode_number": 5,
      "creator_name": "Creator Name",
      "youtube_id": "abc123",
      "vimeo_id": null
    }
  ],
  "total_count": 15,
  "limit": 12
}
```

## Component Architecture

```
ContinueWatching/
├── ContinueWatching.tsx       # Main container component
├── WatchCard.tsx              # Individual video card
├── WatchCardSkeleton.tsx      # Loading skeleton
├── index.ts                   # Exports
└── README.md                  # Documentation
```

## React Query Configuration

The component uses React Query with:
- **Refetch Interval**: 30 seconds
- **Stale Time**: 20 seconds
- **Refetch on Focus**: Enabled
- **Query Key**: `['continueWatching', limit]`

## Responsive Breakpoints

| Screen Size | Columns |
|-------------|---------|
| Mobile (< 640px) | 2 |
| Small (640px+) | 3 |
| Medium (768px+) | 4 |
| Large (1024px+) | 5 |
| XL (1280px+) | 6 |

## Accessibility

- Keyboard navigation (Tab, Enter, Space)
- ARIA labels for screen readers
- Progress bar with aria-valuenow
- Focus indicators
- Semantic HTML

## State Management

### Loading State
Shows skeleton grid while fetching data.

### Error State
Displays error message with retry button.

### Empty State
Shows when user has no videos in progress.

### Success State
Displays grid of video cards with progress bars.

## Dependencies

```json
{
  "@tanstack/react-query": "^5.x",
  "next": "^14.x",
  "react": "^18.x",
  "date-fns": "^3.x",
  "typescript": "^5.x"
}
```

## Customization

### Custom Resume Handler

```tsx
import { WatchSession } from '@/types/continueWatching';

const handleResume = (session: WatchSession) => {
  // Custom logic
  console.log('Resuming:', session);
  router.push(`/watch/${session.content_id}?t=${session.progress}`);
};
```

### Disable Auto-Refresh

```tsx
// In hooks/useContinueWatching.ts
export const useContinueWatching = (options) => {
  return useQuery({
    // ... other options
    refetchInterval: false, // Disable auto-refresh
  });
};
```

## Performance

- **Lazy image loading**: Images load only when visible
- **Image fallbacks**: Gracefully handles missing thumbnails
- **Optimized re-renders**: React Query caching prevents unnecessary fetches
- **Skeleton loading**: Immediate visual feedback

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Troubleshooting

### Images not loading
Check CORS headers on your Laravel API and thumbnail URLs.

### Auto-refresh not working
Verify React Query is properly configured in your app's QueryClientProvider.

### API errors
Check authentication middleware and ensure user is logged in.

## Future Enhancements

- [ ] Swipe gestures for mobile
- [ ] Horizontal scrolling variant
- [ ] Remove from continue watching
- [ ] Custom sorting options
- [ ] Pagination for large libraries
- [ ] Filtering by creator/series
