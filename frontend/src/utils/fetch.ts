// Global fetch wrapper that automatically uses the correct API URL
import { getApiUrl } from '../services/api';

// Override global fetch to automatically prepend API_BASE_URL for /api/* requests
const originalFetch = window.fetch;

window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let url: string;
  
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.toString();
  } else if (input instanceof Request) {
    url = input.url;
  } else {
    url = String(input);
  }
  
  // If it's a relative /api/* URL, convert it to full URL
  if (url.startsWith('/api/')) {
    url = getApiUrl(url);
  }
  
  return originalFetch(url, init);
};

export {};
