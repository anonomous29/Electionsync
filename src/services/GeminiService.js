import { ENDPOINTS } from '../config/constants';

export const GeminiService = {
  askAI: async (query) => {
    const response = await fetch(ENDPOINTS.ASK_AI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  analyzeImage: async (base64String) => {
    const response = await fetch(ENDPOINTS.ANALYZE_IMAGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64String })
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  },
  decodeManifesto: async (partyA, partyB) => {
    const response = await fetch(ENDPOINTS.DECODE_MANIFESTO, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partyA, partyB })
    });
    if (!response.ok) throw new Error('API Error');
    return response.json();
  }
};
