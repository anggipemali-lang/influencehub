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
    return {
      totalCampaigns: 12,
      totalReach: 850000,
      avgEngagement: 4.2,
      conversionRate: 2.1,
      chartData: stats
    };
  } else {
    return {
      totalCampaigns: 4,
      totalReach: 125000,
      avgEngagement: 5.8,
      conversionRate: 3.5,
      chartData: stats.map(s => ({ ...s, value: s.value / 10 }))
    };
  }
};
