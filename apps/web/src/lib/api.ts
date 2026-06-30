/**
 * API client for NeuroDaily backend
 * Automatically attaches Clerk auth token to all requests
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as any;
    throw new ApiError(response.status, errorData?.message || 'Request failed', errorData);
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ========================
// API client factory
// Returns a bound client with the auth token
// ========================
export function createApiClient(token: string) {
  const opts = (method: RequestOptions['method'], body?: unknown): RequestOptions => ({
    method,
    body,
    token,
  });

  return {
    // Users
    getMe: () => request('/users/me', opts('GET')),
    updatePreferences: (data: unknown) => request('/users/me/preferences', opts('PATCH', data)),

    // Onboarding
    completeOnboarding: (data: unknown) => request('/onboarding/complete', opts('POST', data)),

    // Check-ins
    createCheckin: (data: unknown) => request('/checkins', opts('POST', data)),
    getTodayCheckin: () => request('/checkins/today', opts('GET')),

    // Tasks
    getTasks: () => request('/tasks', opts('GET')),
    getTask: (id: string) => request(`/tasks/${id}`, opts('GET')),
    createTask: (data: unknown) => request('/tasks', opts('POST', data)),
    updateTask: (id: string, data: unknown) => request(`/tasks/${id}`, opts('PATCH', data)),
    deleteTask: (id: string) => request(`/tasks/${id}`, opts('DELETE')),
    reorderTasks: (tasks: { id: string; orderIndex: number; dueDate?: string; startTime?: string }[]) => 
      request('/tasks/reorder', opts('PATCH', { tasks })),

    // Micro-actions
    getMicroActions: () => request('/micro-actions', opts('GET')),
    startFocusSession: (data: unknown) => request('/micro-actions/start', opts('POST', data)),
    completeFocusSession: (id: string, data: unknown) =>
      request(`/micro-actions/sessions/${id}/complete`, opts('PATCH', data)),
    submitFeedback: (id: string, data: unknown) =>
      request(`/micro-actions/${id}/feedback`, opts('POST', data)),

    // Recommendations
    getRecommendation: (action: string) =>
      request(`/recommendations?action=${action}`, opts('GET')),
    logRecommendationOutcome: (id: string, data: unknown) =>
      request(`/recommendations/${id}/outcome`, opts('PATCH', data)),

    // First Step
    generateFirstStep: (data: unknown) => request('/first-step/generate', opts('POST', data)),

    // Subscriptions
    getSubscription: () => request('/subscriptions/current', opts('GET')),
    createCheckoutSession: () => request('/subscriptions/checkout', opts('POST')),
    createPortalSession: () => request('/subscriptions/portal', opts('POST')),

    // Admin
    adminGetDashboardStats: () => request('/admin/dashboard-stats', opts('GET')),
    adminGetFeedback: (params: string = '') => request(`/admin/feedback${params ? '?' + params : ''}`, opts('GET')),
    adminGetRecommendationLogs: (params: string = '') => request(`/admin/recommendation-logs${params ? '?' + params : ''}`, opts('GET')),
    adminGetMicroActions: () => request('/admin/micro-actions', opts('GET')),
    adminCreateMicroAction: (data: unknown) =>
      request('/admin/micro-actions', opts('POST', data)),
    adminUpdateMicroAction: (id: string, data: unknown) =>
      request(`/admin/micro-actions/${id}`, opts('PATCH', data)),
    adminToggleMicroAction: (id: string) =>
      request(`/admin/micro-actions/${id}/toggle`, opts('PATCH')),
  };
}
