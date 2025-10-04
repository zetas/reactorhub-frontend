import { creators, patron } from '@/lib/api';
import { buildBrowseCollections } from './transform';
import { BrowseCollections } from './types';

export const fetchBrowseCollections = async (): Promise<BrowseCollections> => {
  const [creatorsRes, continueRes, recentRes, accessRes] = await Promise.all([
    creators.list(),
    patron.getContinueWatching(),
    patron.getRecentlyWatched(),
    patron.getMyAccess(),
  ]);

  return buildBrowseCollections({
    creators: creatorsRes.data?.data ?? [],
    continueWatching: continueRes.data?.data ?? [],
    recentlyWatched: recentRes.data?.data ?? [],
    myCreators: accessRes.data?.data ?? [],
  });
};

export * from './types';
