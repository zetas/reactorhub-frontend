import {
  mapContentResource,
  mapCreatorResource,
  buildBrowseCollections,
  formatDuration,
} from '@/lib/services/browse/transform';

describe('browse transform utilities', () => {
  it('maps API content resource into UI summary', () => {
    const summary = mapContentResource({
      id: 'content-1',
      title: 'Breaking Bad S01E01',
      thumbnail_url: 'https://image',
      duration: 3120,
      content_type: 'tv_series',
      series_name: 'Breaking Bad',
      season: 1,
      episode: 1,
      is_paid: true,
      minimum_tier: 3,
      creator: { name: 'Heisenberg Reacts' },
      watch_progress: {
        watched_seconds: 1560,
        total_seconds: 3120,
        progress_percentage: 50,
      },
    });

    expect(summary).toMatchObject({
      id: 'content-1',
      title: 'Breaking Bad S01E01',
      thumbnail: 'https://image',
      durationLabel: '52m',
      progress: 50,
      seriesName: 'Breaking Bad',
      episodeLabel: 'S1 · E1',
      creatorName: 'Heisenberg Reacts',
      isPaid: true,
      tierRequired: 3,
    });
  });

  it('maps creator resource and normalises counts', () => {
    const creator = mapCreatorResource({
      id: 'creator-1',
      name: 'Creator 1',
      slug: 'creator-1',
      campaign_name: 'Creator 1',
      contents_count: 12,
      patron_count: 4200,
      thumbnail_url: 'https://avatar',
    });

    expect(creator).toEqual({
      id: 'creator-1',
      name: 'Creator 1',
      slug: 'creator-1',
      campaignName: 'Creator 1',
      thumbnail: 'https://avatar',
      patronCount: 4200,
      contentCount: 12,
    });
  });

  it('builds browse collections and chooses featured item', () => {
    const collections = buildBrowseCollections({
      creators: [
        { id: 'c1', name: 'Creator 1', slug: 'creator-1', campaign_name: 'Creator 1' },
      ],
      continueWatching: [
        {
          id: 'cw-1',
          title: 'Continue Episode',
          content_type: 'tv_series',
          watch_progress: { progress_percentage: '75.5' },
        },
      ],
      recentlyWatched: [
        {
          id: 'recent-1',
          title: 'Recent Episode',
        },
      ],
      myCreators: [],
    });

    expect(collections.featured?.id).toBe('cw-1');
    expect(collections.continueWatching).toHaveLength(1);
    expect(collections.recentlyWatched).toHaveLength(1);
    expect(collections.creators).toHaveLength(1);
  });

  it('formats duration helpers gracefully', () => {
    expect(formatDuration(65)).toBe('1m 05s');
    expect(formatDuration(3725)).toBe('1h 02m');
    expect(formatDuration(undefined)).toBeUndefined();
  });
});
