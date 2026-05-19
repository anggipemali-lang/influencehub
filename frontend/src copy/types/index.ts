export type UserRole = 'brand' | 'influencer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: any;
}

export interface InfluencerProfile extends UserProfile {
  niche: string[];
  platforms: ('TikTok' | 'Instagram' | 'YouTube' | 'Twitter')[];
  followersCount: number;
  engagementRate: number;
  location: string;
  audienceDemographics: {
    gender: { male: number; female: number };
    ageRanges: { [key: string]: number };
  };
  pricing: {
    post: number;
    story: number;
    video: number;
  };
  bio: string;
  verified: boolean;
}

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  goals: string[];
  budget: number;
  targetAudience: {
    niche: string[];
    platforms: string[];
    location?: string;
  };
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: any;
  invitedInfluencers: string[];
  activeInfluencers: string[];
}

export interface CollaborationOffer {
  id: string;
  campaignId: string;
  brandId: string;
  influencerId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: any;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
  read: boolean;
}
