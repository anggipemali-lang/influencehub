export const generateRecommendation = async (brandDescription: string, budget: number, influencers: any[]) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/ai/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ brandDescription, budget, influencers }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI recommendation");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    return null;
  }
};
