import { UserRole, getCurrentUserProfile } from './authService';

export interface Campaign {
  id?: string;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  budget: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  targetAudience?: string[];
}

export interface CampaignApplication {
  id?: string;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'brandId' | 'createdAt'>) => {
  const user = getCurrentUserProfile();
  if (!user) throw new Error("Authentication required");

  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...campaignData,
      brandName: user.displayName
    }),
  });

  if (!response.ok) throw new Error("Failed to create campaign");
  return await response.json();
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await fetch('/api/campaigns');
  if (!response.ok) return [];
  return await response.json();
};

export const getBrandCampaigns = async (brandId: string): Promise<Campaign[]> => {
  const response = await fetch(`/api/campaigns/brand/${brandId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) return [];
  return await response.json();
};

export const applyToCampaign = async (campaignId: string, message: string, influencerName: string) => {
  const user = getCurrentUserProfile();
  if (!user) throw new Error("Authentication required");

  const response = await fetch(`/api/campaigns/${campaignId}/apply`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ message, influencerName }),
  });

  if (!response.ok) throw new Error("Failed to apply");
  return await response.json();
};

export const getCampaignApplications = async (campaignId: string): Promise<CampaignApplication[]> => {
  const response = await fetch(`/api/campaigns/${campaignId}/applications`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) return [];
  return await response.json();
};

export const reviewApplication = async (applicationId: string, status: 'approved' | 'rejected') => {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to review application");
};

export interface Offer {
  id?: string;
  brandId: string;
  brandName: string;
  influencerId: string;
  campaignId: string | null;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const sendOffer = async (influencerId: string, message: string, brandName: string) => {
  const response = await fetch('/api/offers', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ influencerId, message, brandName }),
  });
  if (!response.ok) throw new Error("Failed to send offer");
  return await response.json();
};

export const getInfluencerOffers = async (influencerId: string): Promise<Offer[]> => {
  const response = await fetch(`/api/offers/influencer/${influencerId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) return [];
  return await response.json();
};

export const getBrandOffers = async (brandId: string): Promise<Offer[]> => {
  const response = await fetch(`/api/offers/brand/${brandId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) return [];
  return await response.json();
};

export const respondToOffer = async (offerId: string, status: 'accepted' | 'rejected') => {
  const response = await fetch(`/api/offers/${offerId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to respond to offer");
};
