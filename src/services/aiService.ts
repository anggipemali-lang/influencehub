import { MODELS, ai } from '../lib/gemini';
import { InfluencerProfile } from '../types';

export const generateRecommendation = async (brandDescription: string, budget: number, influencers: any[]) => {
  try {
    const prompt = `
      As an expert Influencer Marketing Strategist, analyze the following brand and campaign details:
      Brand/Campaign Description: "${brandDescription}"
      Budget: $${budget}
      
      Available Influencers:
      ${JSON.stringify(influencers.map(i => ({ name: i.displayName, niche: i.niche, price: i.pricing.post, engagement: i.engagementRate })))}
      
      Recommend the top 3 influencers. For each, provide:
      1. Why they are a good match (relevance).
      2. Estimated ROI.
      3. A unique "Match Score" out of 100.
      
      Format the response as JSON.
    `;

    const result = await ai.models.generateContent({
      model: MODELS.FLASH,
      contents: prompt
    });
    
    return result.text;
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    return null;
  }
};
