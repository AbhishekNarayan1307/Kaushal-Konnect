export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function getRecommendedWorkers(category: string, zone: string, budget: number, topN: number = 10) {
  const params = new URLSearchParams({
    category,
    zone,
    budget: budget.toString(),
    top_n: topN.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/recommendations?${params}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No eligible workers found.');
    }
    throw new Error('Failed to fetch recommendations.');
  }

  return response.json();
}
