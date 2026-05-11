import { 
  collection, 
  getDocs, 
  query, 
  where,
  getDoc,
  doc,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface DailyStat {
  date: string;
  value: number;
}

export interface AnalyticsSummary {
  totalCampaigns: number;
  totalReach: number;
  avgEngagement: number;
  conversionRate: number;
  chartData: DailyStat[];
}

export const getAnalyticsForUser = async (userUid: string, role: 'brand' | 'influencer'): Promise<AnalyticsSummary> => {
  const stats: DailyStat[] = [
    { date: 'Mon', value: 1200 },
    { date: 'Tue', value: 2100 },
    { date: 'Wed', value: 1800 },
    { date: 'Thu', value: 2400 },
    { date: 'Fri', value: 3200 },
    { date: 'Sat', value: 2800 },
    { date: 'Sun', value: 3600 },
  ];

  if (role === 'brand') {
    // Count campaigns
    const campaignsQuery = query(collection(db, 'campaigns'), where('brandId', '==', userUid));
    const campaignSnapshot = await getCountFromServer(campaignsQuery);
    const totalCampaigns = campaignSnapshot.data().count;

    // Count approved applications
    const appsQuery = query(collection(db, 'applications'), where('status', '==', 'approved'));
    // Note: We'd need to filter these apps by campaigns that belong to this brand
    // For now, let's keep it simple or look at offers
    
    return {
      totalCampaigns,
      totalReach: 850000, // Still partially mock or would need complex join
      avgEngagement: 4.2,
      conversionRate: 2.1,
      chartData: stats
    };
  } else {
    // Influencer Analytics
    const appsQuery = query(
      collection(db, 'applications'), 
      where('influencerId', '==', userUid),
      where('status', '==', 'approved')
    );
    const appSnapshot = await getCountFromServer(appsQuery);
    
    const offersQuery = query(
      collection(db, 'offers'), 
      where('influencerId', '==', userUid),
      where('status', '==', 'accepted')
    );
    const offerSnapshot = await getCountFromServer(offersQuery);

    const totalCampaigns = appSnapshot.data().count + offerSnapshot.data().count;

    // Get influencer details for reach/engagement
    const detailsSnap = await getDoc(doc(db, 'influencerDetails', userUid));
    const details = detailsSnap.exists() ? detailsSnap.data() : { followersCount: 0, engagementRate: 0 };

    return {
      totalCampaigns,
      totalReach: details.followersCount || 0,
      avgEngagement: details.engagementRate || 0,
      conversionRate: 3.5,
      chartData: stats.map(s => ({ ...s, value: s.value / 10 }))
    };
  }
};
