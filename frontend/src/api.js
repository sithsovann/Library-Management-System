import { API_URL } from './config';

// Wraps fetch so every request automatically includes the auth token
// and the headers Laravel needs to return JSON instead of redirecting.
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  // Only set Content-Type when we're actually sending a body
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw data || { message: `Request failed (${res.status})` };
  }

  return data;
}
