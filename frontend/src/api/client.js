// Frontend API client connected directly to PackSmart FastAPI backend with live data

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function fetchJson(endpoint, options = {}) {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('packsmart_token') : null;
    const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {})
      },
      ...options
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error(`Endpoint ${endpoint} returned HTML (backend API is offline or route was rewritten to index.html).`);
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API call to ${endpoint} failed:`, err);
    throw err;
  }
}

export const api = {
  // 1. Commodities & Food Profiles
  getCommodities: async () => {
    return await fetchJson('/api/commodities');
  },

  searchCommodities: async (query) => {
    return await fetchJson(`/api/commodities/search?q=${encodeURIComponent(query)}`);
  },

  getCommodity: async (commodityId) => {
    return await fetchJson(`/api/commodities/${commodityId}`);
  },

  // 2. Packaging Materials Database
  getMaterials: async (filters = {}) => {
    let url = '/api/materials';
    if (filters.category) {
      url = `/api/materials/filter?category=${encodeURIComponent(filters.category)}`;
    }
    return await fetchJson(url);
  },

  getMaterialDetail: async (materialId) => {
    return await fetchJson(`/api/materials/${materialId}`);
  },

  // 3. Recommendation Engine
  generateRecommendation: async (inputs) => {
    return await fetchJson('/api/recommendation/generate', {
      method: 'POST',
      body: JSON.stringify(inputs)
    });
  },

  // 4. Recommendation History & Reports
  getHistory: async (limit = 20) => {
    return await fetchJson(`/api/history?limit=${limit}`);
  },

  getHistoryDetail: async (recId) => {
    return await fetchJson(`/api/history/${recId}`);
  },

  exportReport: async (recId) => {
    return await fetchJson(`/api/reports/export/${recId}`);
  },

  // 5. Shelf-Life Kinetic Simulation
  predictShelfLife: async (payload) => {
    return await fetchJson('/api/shelf-life/predict', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 6. MAP Advisor
  adviseMap: async (payload) => {
    return await fetchJson('/api/map/advise', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 7. Sustainability & LCA Cost Analyzer
  analyzeSustainability: async (payload) => {
    return await fetchJson('/api/sustainability/analyze', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 8. QR Code & Traceability
  generateQr: async (payload) => {
    return await fetchJson('/api/qr/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getQrScanLogs: async (qrId) => {
    return await fetchJson(`/api/qr/${qrId}/scan-log`);
  },

  recordQrScan: async (qrId, payload) => {
    return await fetchJson(`/api/qr/${qrId}/scan`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 9. Admin & Live Telemetry
  getAnalytics: async () => {
    return await fetchJson('/api/admin/analytics');
  },

  updateModel: async () => {
    return await fetchJson('/api/admin/model/update', {
      method: 'POST'
    });
  },

  getSystemStatus: async () => {
    return await fetchJson('/api/system/status');
  },

  // 10. Authentication
  login: async (email, password) => {
    return await fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  signup: async (name, email, password, role, organization_name) => {
    return await fetchJson('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, organization_name })
    });
  },

  googleLogin: async (token) => {
    return await fetchJson('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },

  getMe: async () => {
    return await fetchJson('/api/auth/me');
  },

  getCurrentUser: async () => {
    return await fetchJson('/api/auth/me');
  },

  logout: async () => {
    return await fetchJson('/api/auth/logout', {
      method: 'POST'
    });
  },

  // 11. User Feedback
  submitFeedback: async (payload) => {
    return await fetchJson('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // 12. Graphical Packaging Formats
  getPackagingFormats: async () => {
    return await fetchJson('/api/packaging-formats');
  },

  getPackagingFormat: async (formatId) => {
    const formats = await api.getPackagingFormats();
    const found = formats.find(f => f.format_id === formatId);
    if (!found) throw new Error("Packaging format not found");
    return found;
  },

  // 13. Preservatives & Additives Guide
  getPreservatives: async () => {
    return await fetchJson('/api/preservatives');
  },

  // 14. Compliance & Launch Checklist
  getComplianceChecklist: async (jurisdiction = "India — FSSAI", category = null) => {
    let url = `/api/compliance-checklist?jurisdiction=${encodeURIComponent(jurisdiction)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    return await fetchJson(url);
  },

  getChecklistProgress: async (userId = null, jurisdiction = "India — FSSAI") => {
    let url = `/api/compliance-checklist/progress?jurisdiction=${encodeURIComponent(jurisdiction)}`;
    if (userId) url += `&user_id=${encodeURIComponent(userId)}`;
    return await fetchJson(url);
  },

  saveChecklistProgress: async (payload, userId = null) => {
    let url = '/api/compliance-checklist/progress';
    if (userId) url += `?user_id=${encodeURIComponent(userId)}`;
    const res = await fetchJson(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`packsmart_checklist_${payload.jurisdiction}`, JSON.stringify(payload.completed_item_ids));
    }
    return res;
  }
};
