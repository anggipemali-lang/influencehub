import React from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InfluencerProfile } from '../types';

// Mock influencers for initial development if Firestore is empty
export const mockInfluencers: Partial<InfluencerProfile>[] = [
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
  },
  {
    uid: '3',
    displayName: 'Chef Marco',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    niche: ['Food', 'Lifestyle'],
    platforms: ['Instagram', 'YouTube'],
    followersCount: 420000,
    engagementRate: 3.5,
    location: 'New York, NY',
    verified: false,
    pricing: { post: 800, story: 300, video: 1800 }
  },
  {
    uid: '4',
    displayName: 'Fit Lexi',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    niche: ['Fitness', 'Wellness'],
    platforms: ['Instagram', 'TikTok'],
    followersCount: 2100000,
    engagementRate: 5.1,
    location: 'Miami, FL',
    verified: true,
    pricing: { post: 2500, story: 800, video: 5000 }
  }
];

export const getInfluencers = async (filters?: any) => {
  // Real implementation would use Firestore
  // For now, return mock data
  return mockInfluencers;
};
