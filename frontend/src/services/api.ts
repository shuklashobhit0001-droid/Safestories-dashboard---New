// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://safestories-api.onrender.com'
    : 'http://localhost:3001');

console.log('🔗 API Base URL:', API_BASE_URL);

// API Helper function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string; portal?: string }) =>
    apiRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verifyPassword: (credentials: { username: string; password: string }) =>
    apiRequest('/api/verify-password', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  changePassword: (data: { userId: string; newPassword: string }) =>
    apiRequest('/api/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePassword: (data: { user_id: string; new_password: string }) =>
    apiRequest('/api/update-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Forgot Password API
export const forgotPasswordAPI = {
  sendOTP: (email: string) =>
    apiRequest('/api/forgot-password/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// Therapist API
export const therapistAPI = {
  createRequest: (data: any) =>
    apiRequest('/api/new-therapist-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyOTP: (data: { email: string; otp: string }) =>
    apiRequest('/api/verify-therapist-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  completeProfile: (data: any) =>
    apiRequest('/api/complete-therapist-profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  checkDetails: (email: string) =>
    apiRequest(`/api/check-therapist-details?email=${encodeURIComponent(email)}`),

  getProfile: (params: { therapist_id?: string; email?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.therapist_id) searchParams.append('therapist_id', params.therapist_id);
    if (params.email) searchParams.append('email', params.email);
    return apiRequest(`/api/therapist-profile?${searchParams.toString()}`);
  },

  updateProfile: (data: any) =>
    apiRequest('/api/therapist-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return apiRequest('/api/upload-file', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  },
};

// Issue Reporting API
export const issueAPI = {
  reportIssue: (data: any) =>
    apiRequest('/api/report-issue', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// CRM API
export const crmAPI = {
  getLeads: () => apiRequest('/api/leads'),
  
  getLead: (id: string) => apiRequest(`/api/leads/${id}`),
  
  createLead: (data: any) =>
    apiRequest('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateLead: (id: string, data: any) =>
    apiRequest(`/api/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  updateLeadStage: (id: string, data: any) =>
    apiRequest(`/api/leads/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  convertVirtualLead: (data: any) =>
    apiRequest('/api/leads/convert-virtual', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getLeadManagers: () => apiRequest('/api/lead-managers'),
  
  getAnalytics: (params?: any) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`/api/analytics?${searchParams.toString()}`);
  },
  
  getTodo: () => apiRequest('/api/crm/todo'),
};

// Pre-therapy Form API
export const pretherapyAPI = {
  submitForm: (data: any) =>
    apiRequest('/api/pretherapy-form', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getForm: (leadId: string) => apiRequest(`/api/pretherapy-form/${leadId}`),
  
  updateForm: (leadId: string, data: any) =>
    apiRequest(`/api/pretherapy-form/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Health Check
export const healthAPI = {
  check: () => apiRequest('/health'),
};

export default {
  auth: authAPI,
  forgotPassword: forgotPasswordAPI,
  therapist: therapistAPI,
  upload: uploadAPI,
  issue: issueAPI,
  crm: crmAPI,
  pretherapy: pretherapyAPI,
  health: healthAPI,
};