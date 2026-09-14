export const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
export const API_BASE_URL = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/$/, '')
  : import.meta.env.DEV
    ? 'http://localhost:8000/api'
    : '';

export const isApiConfigured = Boolean(API_BASE_URL);

async function apiRequest(endpoint, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('The production API URL is not configured. Set VITE_API_BASE_URL in Vercel.');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorData}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function fetchEmployees() {
  return apiRequest('/employees/');
}

export async function createEmployee(payload) {
  return apiRequest('/employees/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchProjects() {
  return apiRequest('/projects/');
}

export async function createProject(payload) {
  return apiRequest('/projects/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchFinance() {
  return apiRequest('/finance/');
}

export async function createFinance(payload) {
  return apiRequest('/finance/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchRecommendations({ topN = 5, requiredSkill = '', department = '', priority = '' } = {}) {
  const params = new URLSearchParams({ top_n: topN });

  if (requiredSkill) params.set('required_skill', requiredSkill);
  if (department) params.set('department', department);
  if (priority) params.set('task_priority', priority);

  return apiRequest(`/recommendations/?${params.toString()}`);
}

export async function predictTaskCompletion(payload) {
  return apiRequest('/ml/task-completion/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

