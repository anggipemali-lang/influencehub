export const mockInfluencers: any[] = [
  {
    uid: '1',
    displayName: 'Sophia Bloom',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    niche: ['Beauty', 'Fashion'],
    platforms: ['Instagram', 'TikTok'],
    followersCount: 1250000,
    engagementRate: 4.8,
    location: 'Los Angeles, CA',
    verified: true,
    pricing: { post: 1500, story: 500, video: 3000 }
  },
  {
    uid: '2',
    displayName: 'Alex Tech',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    niche: ['Technology', 'Gaming'],
    platforms: ['YouTube', 'Twitter'],
    followersCount: 850000,
    engagementRate: 6.2,
    location: 'San Francisco, CA',
    verified: true,
    pricing: { post: 1200, story: 400, video: 2500 }
  }
];

export const getInfluencers = async (filters?: any) => {
  return mockInfluencers;
};
