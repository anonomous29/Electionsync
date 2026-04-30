export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const ENDPOINTS = {
  LOCATE: `${API_BASE_URL}/api/locate`,
  VALIDATE_ID: `${API_BASE_URL}/api/validate-id`,
  ANALYZE_IMAGE: `${API_BASE_URL}/api/analyze-id-image`,
  ASK_AI: `${API_BASE_URL}/api/ask-ai`,
  DECODE_MANIFESTO: `${API_BASE_URL}/api/decode-manifesto`
};
