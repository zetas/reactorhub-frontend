# Continue Watching Implementation Guide

## Installation Steps

### 1. Install Dependencies

```bash
npm install @tanstack/react-query date-fns
# or
yarn add @tanstack/react-query date-fns
```

### 2. Set Up React Query Provider

If not already configured, wrap your app with QueryClientProvider:

```tsx
// app/layout.tsx or pages/_app.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 3. Configure API Client

Ensure your API client is set up in `lib/api.ts`:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For Laravel Sanctum auth
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. Laravel Backend Setup

#### Create Migration for Watch Sessions (if not exists)

```bash
php artisan make:migration create_watch_sessions_table
```

```php
// database/migrations/xxxx_create_watch_sessions_table.php
Schema::create('watch_sessions', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('patron_id')->constrained('patrons');
    $table->foreignUuid('content_id')->constrained('reactor_contents');
    $table->foreignUuid('creator_id')->constrained('creators');
    $table->integer('progress_seconds')->default(0);
    $table->integer('total_seconds');
    $table->decimal('completion_percentage', 5, 2)->default(0);
    $table->boolean('completed')->default(false);
    $table->timestamp('last_updated_at')->nullable();
    $table->timestamps();

    $table->index(['patron_id', 'last_updated_at']);
});
```

#### Update Laravel Route

```php
// routes/api.php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/patron/continue-watching', [PatronDashboardController::class, 'continueWatching']);
    Route::post('/patron/watch-progress', [PatronDashboardController::class, 'updateWatchProgress']);
});
```

#### Controller Method

```php
// app/Http/Controllers/Api/PatronDashboardController.php
public function continueWatching(Request $request): JsonResponse
{
    $limit = $request->get('limit', 12);
    $patronId = $request->user()->patron->id;

    $sessions = app(ContinueWatchingService::class)
        ->getContinueWatching($patronId, $limit);

    return response()->json([
        'sessions' => $sessions,
        'total_count' => count($sessions),
        'limit' => $limit,
    ]);
}
```

## TypeScript Configuration

Ensure your `tsconfig.json` has path aliases configured:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/types/*": ["types/*"],
      "@/hooks/*": ["hooks/*"],
      "@/lib/*": ["lib/*"]
    }
  }
}
```

## Tailwind CSS Configuration

Ensure these colors are in your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        slate: {
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
};
```

## Environment Variables

Create or update `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## File Structure

After implementation, your project should have:

```
├── app/
│   └── dashboard/
│       └── page.tsx                        # Updated with ContinueWatching
├── components/
│   └── ContinueWatching/
│       ├── ContinueWatching.tsx           # Main component
│       ├── WatchCard.tsx                  # Card component
│       ├── WatchCardSkeleton.tsx          # Loading skeleton
│       ├── index.ts                       # Exports
│       ├── README.md                      # Documentation
│       ├── IMPLEMENTATION.md              # This file
│       └── __tests__/
│           └── ContinueWatching.test.tsx  # Tests
├── hooks/
│   └── useContinueWatching.ts             # React Query hook
├── types/
│   └── continueWatching.ts                # TypeScript types
└── lib/
    └── api.ts                             # API client (should exist)
```

## Testing

### Unit Tests

```bash
npm run test
```

### Manual Testing

1. Start Laravel backend:
   ```bash
   cd app-laravel
   php artisan serve
   ```

2. Start Next.js dev server:
   ```bash
   npm run dev
   ```

3. Navigate to `/dashboard`

4. You should see the Continue Watching component with:
   - Loading skeletons (first load)
   - Video cards (if you have watch sessions)
   - Empty state (if no sessions)
   - Error state (if API fails)

## Troubleshooting

### CORS Issues

Add to Laravel's `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'supports_credentials' => true,
```

### Authentication Issues

Ensure Sanctum is configured:

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Update `.env`:
```
SESSION_DRIVER=cookie
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Image Loading Issues

Check:
1. CORS headers on image URLs
2. Content Security Policy
3. Image proxy if using external URLs

### Auto-Refresh Not Working

Verify:
1. React Query is properly installed
2. QueryClientProvider wraps your app
3. refetchInterval is not disabled

## Performance Optimization

### Enable React Query DevTools (development only)

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Image Optimization

If using Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src={getThumbnailUrl()}
  alt={session.title}
  width={320}
  height={180}
  className="h-full w-full object-cover"
  loading="lazy"
/>
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up React Query provider
3. ✅ Configure API client
4. ✅ Set up Laravel backend routes
5. ✅ Test the component
6. ⬜ Add analytics tracking
7. ⬜ Add remove from continue watching feature
8. ⬜ Add series grouping
9. ⬜ Add filtering options

## Additional Features to Consider

- **Keyboard shortcuts**: Arrow keys to navigate cards
- **Drag to reorder**: Allow users to reorder their continue watching list
- **Remove option**: Add "X" button to remove items
- **Watch together**: Social watching features
- **Recommendations**: "Because you watched..." suggestions
- **Watch party**: Sync playback with friends

## Support

For issues or questions:
1. Check the README.md
2. Review test files for examples
3. Check React Query documentation
4. Review Laravel backend logs
